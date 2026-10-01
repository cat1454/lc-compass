"use client";
import { useState } from "react";
import type { EventItem } from "../../contracts/event";
import styles from "./EventMapView.module.css";

export function EventPhoto({ image }: { image: EventItem["image"] }) {
  const [failed, setFailed] = useState(false);
  return <figure className={styles.photo}>
    {image && !failed ? <>
      {/* Source images can be hosted by any reviewed organizer, without an image proxy. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} width={640} height={360} onError={() => setFailed(true)} />
      {image.kind === "venue" && <figcaption>Ảnh địa điểm</figcaption>}
    </> : <span role="status">Ảnh chưa tải được</span>}
  </figure>;
}
