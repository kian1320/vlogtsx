"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import "../../styles.css";

export default function EditBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get("id");

    useEffect(() => {
        if (!blogId) {
            router.push("/dashboard");
            return;
        }
        fetchBlog();
    }, [blogId]);

    const fetchBlog = async () => {
        let { data, error } = await supabase.from("blogs").select("*").eq("id", blogId).single();
        if (!error && data) {
            setTitle(data.title);
            setContent(data.content);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from("blogs").update({ title, content }).eq("id", blogId);
        if (error) setError(error.message);
        else router.push("/dashboard");
    };

    return (
        <div className="container">
            <h2>Edit Blog</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleUpdate}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                <button type="submit">Update</button>
            </form>
            <button onClick={() => router.push("/dashboard")}>Back</button>
        </div>
    );
}
