'use client';
import { useState, useEffect } from 'react';

import styles from "./like_button.module.css";

export default function LikeButton({ contentId }: { contentId: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [justLiked, setJustLiked] = useState(false);

  // Fetch initial likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/like?contentID=${encodeURIComponent(contentId)}`, {
        method: 'GET',
      });

      const data = await res.json();
        if (data.success) {
          setLikes(data.likes);
        }
      } catch (err) {
        console.error('Error fetching initial likes:', err);
      }
    };

    fetchLikes();
  }, [contentId]);

  // Sending a like
  const sendLike = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.likes != likes) {
          setLikes(data.likes);
          setJustLiked(true);
          setTimeout(() => setJustLiked(false), 2000); // Reset animation
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Return 
  return (
    <div className={styles["like-container"]} onClick={sendLike}>
      <span className={`${styles["like-count"]} ${justLiked ? styles["like-count-glow"] : ""}`}>{likes !== null ? likes : '-'}</span>
      <span className={`${styles["like-icon"]} ${justLiked ? styles["animate-like"] : ""}`}>💚</span>
    </div>
  );
}