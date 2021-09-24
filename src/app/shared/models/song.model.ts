/*
 * now-playing.model.ts (c) COPYRIGHT 2020 RAIZ UAI CONFIDENTIAL RESTRICTED
 */

/**
 * Represents an user entity
 *
 * @export
 * @interface User
 */
export interface Song {
    album: string;
    art: string;
    artist: string;
    custom_fields: [];
    id: string;
    lyrics: number;
    text: string;
    title: string;
}
