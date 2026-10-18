// src/utils/searchTrie.js

/**
 * Node in the Prefix Trie
 */
class TrieNode {
  constructor() {
    this.children = new Map(); // char -> TrieNode
    this.itemIds = new Set();   // Set of item IDs containing a token with this prefix
  }
}

/**
 * SearchTrieIndex: A high-performance DSA Inverted Prefix Trie & Postings Engine.
 * 
 * - Tokenization: O(M) time normalization and token extraction.
 * - Insertion: O(N * L) where N is number of tokens, L is avg token length.
 * - Prefix Search: O(P) where P is length of query prefix.
 * - Multi-token Query: O(K * P + min(|S_i|)) using postings list intersection heuristic.
 * - Relevance Ranking: Multi-tier scoring (exact phrase > title > brand/model > location > description).
 */
export class SearchTrieIndex {
  constructor() {
    this.root = new TrieNode();
    this.itemMetaMap = new Map(); // id -> item metadata for fast O(1) attribute lookup
  }

  /**
   * Tokenize string into lowercase alphanumeric words
   */
  static tokenize(text) {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }

  /**
   * Insert an item with its searchable field values into the Trie
   */
  insert(id, itemType, raw, weightedFields = {}) {
    const meta = {
      id,
      itemType,
      raw,
      title: weightedFields.title || "",
      brandModel: weightedFields.brandModel || "",
      location: weightedFields.location || "",
      specs: weightedFields.specs || "",
      desc: weightedFields.desc || "",
      price: Number(raw.price ?? raw.expectedPrice ?? raw.expected_price ?? 0),
      createdAt: raw.createdAt || raw.created_at || 0,
    };
    this.itemMetaMap.set(id, meta);

    // Collect distinct tokens across all searchable fields
    const allTokens = new Set();
    Object.values(weightedFields).forEach((fieldVal) => {
      SearchTrieIndex.tokenize(fieldVal).forEach((tok) => {
        allTokens.add(tok);
      });
    });

    // Insert all tokens into the Prefix Trie
    allTokens.forEach((token) => {
      let node = this.root;
      node.itemIds.add(id);

      for (let i = 0; i < token.length; i++) {
        const char = token[i];
        let child = node.children.get(char);
        if (!child) {
          child = new TrieNode();
          node.children.set(char, child);
        }
        node = child;
        node.itemIds.add(id);
      }
    });
  }

  /**
   * Prefix search in Trie: O(P) time
   * @param {string} prefix
   * @returns {Set<string>|null}
   */
  searchPrefix(prefix) {
    const cleanPrefix = prefix.toLowerCase().trim();
    if (!cleanPrefix) return null;

    let node = this.root;
    for (let i = 0; i < cleanPrefix.length; i++) {
      const char = cleanPrefix[i];
      const child = node.children.get(char);
      if (!child) {
        return new Set(); // 0 matches for this prefix
      }
      node = child;
    }
    return node.itemIds;
  }

  /**
   * Fast multi-token search with postings list intersection & relevance scoring
   * @param {string} query
   * @returns {Map<string, number>|null} Map of itemId -> relevance score (or null if query is empty)
   */
  search(query) {
    const queryTokens = SearchTrieIndex.tokenize(query);
    if (queryTokens.length === 0) return null; // No search filter

    const tokenMatchSets = [];
    for (const token of queryTokens) {
      const matches = this.searchPrefix(token);
      if (!matches || matches.size === 0) {
        // One token produced 0 matches -> intersection is empty!
        return new Map();
      }
      tokenMatchSets.push(matches);
    }

    // Sort sets by cardinality ascending (smallest set first — classic IR heuristic)
    tokenMatchSets.sort((a, b) => a.size - b.size);

    // Intersect all postings lists starting from the smallest
    let candidateIds = new Set(tokenMatchSets[0]);
    for (let i = 1; i < tokenMatchSets.length; i++) {
      const currentSet = tokenMatchSets[i];
      const nextCandidates = new Set();
      for (const id of candidateIds) {
        if (currentSet.has(id)) {
          nextCandidates.add(id);
        }
      }
      candidateIds = nextCandidates;
      if (candidateIds.size === 0) break;
    }

    // Compute relevance ranking scores for matched candidate IDs
    const scoreMap = new Map();
    const queryLower = query.toLowerCase().trim();

    candidateIds.forEach((id) => {
      const meta = this.itemMetaMap.get(id);
      if (!meta) return;

      let score = 10; // Base match score
      const titleLower = meta.title.toLowerCase();
      const brandModelLower = meta.brandModel.toLowerCase();
      const locationLower = meta.location.toLowerCase();
      const descLower = meta.desc.toLowerCase();

      // Exact full query match in title
      if (titleLower.includes(queryLower)) {
        score += 100;
        if (titleLower.startsWith(queryLower)) score += 50;
      }

      // Brand / Model match
      if (brandModelLower.includes(queryLower)) {
        score += 80;
      }

      // Location match
      if (locationLower.includes(queryLower)) {
        score += 60;
      }

      // Token-level boosts
      queryTokens.forEach((tok) => {
        if (titleLower.includes(tok)) score += 25;
        if (brandModelLower.includes(tok)) score += 20;
        if (locationLower.includes(tok)) score += 15;
        if (descLower.includes(tok)) score += 10;
      });

      scoreMap.set(id, score);
    });

    return scoreMap;
  }
}
