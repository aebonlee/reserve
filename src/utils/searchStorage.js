/**
 * searchStorage.js
 * 통합 검색 — blog/board/gallery ilike 병렬 검색
 */

import getSupabase from './supabase';

function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function toCamel(row) {
  if (!row) return null;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamelKey(k)] = v;
  }
  return out;
}

/**
 * 통합 검색: blog_posts, board_posts, gallery_items에서 ilike 병렬 검색
 * @param {string} query - 검색어
 * @returns {{ blog: Array, board: Array, gallery: Array }}
 */
export async function searchAll(query) {
  const client = getSupabase();
  if (!client || !query.trim()) {
    return { blog: [], board: [], gallery: [] };
  }

  const pattern = `%${query.trim()}%`;

  const [blogRes, boardRes, galleryRes] = await Promise.all([
    client
      .from('blog_posts')
      .select('id, title, title_en, excerpt, excerpt_en, category, category_en, date')
      .or(`title.ilike.${pattern},title_en.ilike.${pattern},excerpt.ilike.${pattern},excerpt_en.ilike.${pattern}`)
      .order('id', { ascending: false })
      .limit(5),
    client
      .from('board_posts')
      .select('id, title, category, author, date')
      .or(`title.ilike.${pattern},content.ilike.${pattern}`)
      .order('id', { ascending: false })
      .limit(5),
    client
      .from('gallery_items')
      .select('id, title, title_en, description, description_en, category, date')
      .or(`title.ilike.${pattern},title_en.ilike.${pattern},description.ilike.${pattern},description_en.ilike.${pattern}`)
      .order('id', { ascending: false })
      .limit(5)
  ]);

  return {
    blog: (blogRes.data || []).map(toCamel),
    board: (boardRes.data || []).map(toCamel),
    gallery: (galleryRes.data || []).map(toCamel)
  };
}
