"use client";

import Image from "next/image";
import React from "react";

import LikeButton from "./like_button";
import styles from "./masonry_grid.module.css";

export default function MasonryGrid({ imagePaths }: { imagePaths: string[] }) {
  return (
    <div className={styles.masonry}>
      {imagePaths.map((src, idx) => (
        <div key={idx} className={styles.item}>
          <div className={styles.imageContainer}>
            <Image
              src={src}
              alt=""
              width={500}
              height={500}
              sizes="(max-width: 500px) 100vw, 33vw"
              className={styles.image}
            />
            <div className={styles["like-container"]}>
              <LikeButton contentId={src} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


