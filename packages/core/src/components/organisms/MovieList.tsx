import React, {useEffect, useState} from "react";
import {useApp} from "../pages/AppContext";

export function MovieList() {
    const app = useApp()
    const [movies, setMovies] = useState<any[]>([])

    useEffect(() => {
        (async () => {
            const movies: any[] = []
            //for await (const movie of app.library.getMovies()) {
            //    movies.push(movie)
            //}
            setMovies(movies)
        })()
    }, [app])

    return <div>{movies.map(m => m.id).join(', ')}</div>
}