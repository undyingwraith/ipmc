import React, {useEffect, useState} from "react";
import {useApp} from "../AppContext";

export function MovieList() {
    const app = useApp()
    const [movies, setMovies] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            const movies = []
            for await (const movie of app.library.getMovies()) {
                movies.push(movie)
            }
            setMovies(movies)
        })()
    }, [app])

    return <div>{movies.map(m => m.id).join(', ')}</div>
}