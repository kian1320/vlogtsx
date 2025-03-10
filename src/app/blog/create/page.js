"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import "../../styles.css";

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setError("You must be logged in to create a blog.");

        const { error } = await supabase.from("blogs").insert([{ title, content, created_by: user.id }]);
        if (error) setError(error.message);
        else router.push("/dashboard");
    };

    return (
        <div className="container">
            <h2>Create Blog</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleCreate}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                <button type="submit">Create</button>
            </form>
            <button onClick={() => router.push("/dashboard")}>Back</button>
        </div>
    );
}
