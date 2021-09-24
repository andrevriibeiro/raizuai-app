/*
 * now-playing.model.ts (c) COPYRIGHT 2020 RAIZ UAI CONFIDENTIAL RESTRICTED
 */

import { Song } from './song.model';

/**
 * Represents an user entity
 *
 * @export
 * @interface User
 */
export interface NowPlaying {
    duration: number;
    elapsed: number;
    is_request: boolean;
    played_at: string;
    playlist: string;
    remaining: number;
    sh_id: number;
    song: Song;
}
