import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MyContext } from "./Mycontext";
import DOMPurify from 'dompurify';
import './Main.css';

export function Main() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newPost, setNewPost] = useState({ title: '', content: '', status: 'public', type: 'technology' });
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const { currentUser } = useContext(MyContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3000/posts')
            .then(response => {
                const filteredPosts = response.data.filter(post =>
                    post.status === 'public' || post.username === currentUser.username
                );
                setPosts(filteredPosts);

                const likesPromises = filteredPosts.map(post =>
                    axios.get(`http://localhost:3000/posts/${post.id}/likes`)
                        .then(likesResponse => ({ postId: post.id, likes: likesResponse.data }))
                );

                Promise.all(likesPromises)
                    .then(likesData => {
                        const updatedLikes = likesData.reduce((acc, likeData) => {
                            acc[likeData.postId] = likeData.likes;
                            return acc;
                        }, {});
                        setLikes(updatedLikes);
                    });
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, [currentUser.username]);

    const handleAddPost = () => {
        const sanitizedContent = DOMPurify.sanitize(newPost.content).replace(/<\/?p>/g, '');

        axios.post('http://localhost:3000/posts', {
            ...newPost,
            content: sanitizedContent,
            username: currentUser.username
        })
            .then(response => {
                setPosts([...posts, response.data]);
                setNewPost({ title: '', content: '', status: 'public', type: 'technology' });
                setIsCreatingPost(false);
            })
            .catch(error => console.error('Error adding post:', error));
    };

    const handleDelete = (id, username) => {
        // Check if the logged-in user is the author of the post
        if (username !== currentUser.username) {
            alert('You can only delete your own posts!');
            return;
        }

        // Display a confirmation dialog
        const confirmDelete = window.confirm('Bạn chắc chắn muốn xóa bài viết?');

        if (confirmDelete) {
            axios.delete(`http://localhost:3000/posts/${id}`)
                .then(() => {
                    setPosts(posts.filter(post => post.id !== id));
                })
                .catch(error => console.error('Error deleting post:', error));
        }
    };

    const handleSearch = () => {
        const url = searchTerm
            ? `http://localhost:3000/posts?search=${searchTerm}`
            : 'http://localhost:3000/posts';

        axios.get(url)
            .then(response => {
                const filteredPosts = response.data.filter(post =>
                    post.status === 'public' || post.username === currentUser.username
                );
                setPosts(filteredPosts);
            })
            .catch(error => console.error('Error searching posts:', error));
    };

    const handleLike = (postId) => {
        axios.post(`http://localhost:3000/posts/${postId}/like`, { username: currentUser.username })
            .then(() => {
                setLikes({
                    ...likes,
                    [postId]: [...likes[postId], { username: currentUser.username }]
                });
            })
            .catch(error => console.error('Error liking post:', error));
    };

    const handleUnlike = (postId) => {
        axios.post(`http://localhost:3000/posts/${postId}/unlike`, { username: currentUser.username })
            .then(() => {
                setLikes({
                    ...likes,
                    [postId]: likes[postId].filter(like => like.username !== currentUser.username)
                });
            })
            .catch(error => console.error('Error unliking post:', error));
    };

    return (
        <div className="main-container">
            <div className="header-container">
                <button className="toggle-form-button" onClick={() => setIsCreatingPost(!isCreatingPost)}>
                    {isCreatingPost ? 'Cancel' : 'Create New Post'}
                </button>
                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {isCreatingPost && (
                <div className="create-post-container">
                    <h2>Create New Post</h2>
                    <div className="post-creation-form">
                        <input
                            className="post-title-input"
                            type="text"
                            placeholder="Post Title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                        <CKEditor
                            editor={ClassicEditor}
                            data={newPost.content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewPost({ ...newPost, content: data });
                            }}
                        />
                        <div className="post-status-container">
                            <select
                                className="post-status-select"
                                value={newPost.status}
                                onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                            <button className="add-post-button" onClick={handleAddPost}>Post</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="posts-container">
                {posts.map(post => (
                    <div key={post.id} className="post-card">
                        <div className="post-actions-above">
                            {post.username === currentUser.username && (
                                <>
                                    <button className="edit-post-button"
                                            onClick={() => navigate(`/edit/${post.id}`)}>Edit
                                    </button>
                                    <button className="delete-post-button"
                                            onClick={() => handleDelete(post.id, post.username)}>Delete
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="post-header">
                            <span className="post-author">{post.username}: Đã viết</span>
                            <h3>{post.title}</h3>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        <div className="post-info">
                            <span className="post-status">{post.status}</span>
                        </div>
                        <div className="post-actions">
                            {likes[post.id] && likes[post.id].some(like => like.username === currentUser.username) ? (
                                <button className="unlike-button" onClick={() => handleUnlike(post.id)}>Unlike</button>
                            ) : (
                                <button className="like-button" onClick={() => handleLike(post.id)}>Like</button>
                            )}

                            <div className="likes-container">
                                <span>{likes[post.id]?.length || 0} likes</span>
                                {likes[post.id] && likes[post.id].length > 0 && (
                                    <div className="liked-users">
                                        <ul>
                                            {likes[post.id].map((like, index) => (
                                                <li key={index}>{like.username}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
