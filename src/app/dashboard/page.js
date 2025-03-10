"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import "../styles.css";

export default function Dashboard() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/login"); // Redirect if not logged in
        };
        checkUser();
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        let { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
        if (!error) setBlogs(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        await supabase.from("blogs").delete().eq("id", id);
        fetchBlogs(); // Refresh list
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout failed:", error.message);
        } else {
            router.push("/login"); // Redirect to login page after logout
        }
    };

    return (
        <div className="container">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <button onClick={() => router.push("/blog/create")}>+ Create Blog</button>
            {loading ? <p>Loading...</p> : (
                blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog.id} className="blog-card">
                            <h3>{blog.title}</h3>
                            <p>{blog.content.substring(0, 100)}...</p>
                            <button onClick={() => router.push(`/blog/edit?id=${blog.id}`)}>Edit</button>
                            <button onClick={() => handleDelete(blog.id)}>Delete</button>
                        </div>
                    ))
                ) : <p>No blogs found.</p>
            )}
        </div>
    );
}
