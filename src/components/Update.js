import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function UpdatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('public');
    const { id } = useParams();  // Get the post ID from the URL
    const navigate = useNavigate();

    // Fetch post data on component load
    useEffect(() => {
        axios.get(`http://localhost:3000/posts/${id}`)
            .then((res) => {
                const data = res.data;
                setTitle(data.title);
                setContent(data.content);
                setStatus(data.status);
            })
            .catch((err) => {
                console.error('Error fetching post data:', err);
            });
    }, [id]);

    // Handle updating the post
    const submitUpdate = () => {
        const updatedPost = {
            title: title,
            content: content,
            status: status
        };

        axios.put(`http://localhost:3000/posts/${id}`, updatedPost)
            .then(() => {
                alert('Post updated successfully!');
                navigate('/');  // Redirect to the homepage after updating
            })
            .catch(error => {
                console.error('There was an error updating the post!', error);
            });
    };

    return (
        <div className="container">
            <h1>Edit Post</h1>
            {/* Input for title */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />

            {/* CKEditor for content editing */}
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
            />

            {/* Dropdown for post status */}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>

            {/* Submit button */}
            <button onClick={submitUpdate}>Submit</button>
        </div>
    );
}

export default UpdatePost;
