/**
 * Custom hooks that encapsulate all blog-related Supabase logic:
 *  - useBlogs: load blogs (all, or one author's), create a blog, delete a blog
 *  - useBlog: load one blog by id and update it
 *
 * Row Level Security on the "blogs" table is the real security boundary:
 * anyone can read blogs, but only the author can insert, update or delete.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

function useBlogs(authorId = null) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads blogs from the Supabase "blogs" table, newest first.
   * With an authorId, only that author's blogs are loaded.
   */
  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (authorId) {
      query = query.eq("author_id", authorId);
    }

    const { data, error: queryError } = await query;

    if (queryError) {
      setError(`Could not load blogs: ${queryError.message}`);
    } else {
      setBlogs(data ?? []);
    }

    setLoading(false);
  }, [authorId]);

  /**
   * Creates a blog for the signed-in user and adds it to local state.
   * The author name comes from user_metadata.display_name (never the email).
   *
   * @param {{ title: string, excerpt: string, content: string }} values
   * @param {object} user - The Supabase user from useAuth().
   */
  const createBlog = useCallback(async ({ title, excerpt, content }, user) => {
    const displayName = user?.user_metadata?.display_name;

    if (!user || !displayName) {
      throw new Error(
        "Your account needs a display name before you can publish.",
      );
    }

    const { data, error: insertError } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          excerpt,
          content,
          author_id: user.id,
          author_name: displayName,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    setBlogs((currentBlogs) => [data, ...currentBlogs]);

    return data;
  }, []);

  /**
   * Deletes a blog by id from Supabase and local state.
   * RLS silently ignores deletes of other people's rows, so we check that
   * a row was actually removed.
   *
   * @param {string} id - Blog ID (uuid).
   */
  const deleteBlog = useCallback(async (id) => {
    const { data, error: deleteError } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select("id");

    if (deleteError) {
      throw deleteError;
    }

    if (!data || data.length === 0) {
      throw new Error(
        "This blog could not be deleted. Only its author can delete it.",
      );
    }

    setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== id));
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      await loadBlogs();
    };

    fetchBlogs();
  }, [loadBlogs]);

  return {
    blogs,
    loading,
    error,
    createBlog,
    deleteBlog,
  };
}

function useBlog(blogId) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads one blog by id. A missing blog leaves `blog` as null.
   */
  const loadBlog = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .maybeSingle();

    if (queryError) {
      setError(`Could not load this blog: ${queryError.message}`);
      setBlog(null);
    } else {
      setBlog(data);
    }

    setLoading(false);
  }, [blogId]);

  /**
   * Updates this blog. updated_at is set from the application.
   *
   * @param {{ title: string, excerpt: string, content: string }} values
   */
  const updateBlog = useCallback(
    async ({ title, excerpt, content }) => {
      const { data, error: updateError } = await supabase
        .from("blogs")
        .update({
          title,
          excerpt,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blogId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setBlog(data);

      return data;
    },
    [blogId],
  );

  useEffect(() => {
    const fetchBlog = async () => {
      await loadBlog();
    };

    fetchBlog();
  }, [loadBlog]);

  return {
    blog,
    loading,
    error,
    updateBlog,
  };
}

export { useBlogs, useBlog };
