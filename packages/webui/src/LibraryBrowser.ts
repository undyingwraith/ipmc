import {Helia} from "helia";
import {CID} from "multiformats";
import {UnixFS, unixfs} from "@helia/unixfs";

export class LibraryBrowser {
    private fs: UnixFS;

    constructor(node: Helia, private root: CID) {
        this.fs = unixfs(node)
    }

    async *getMovies(): AsyncIterable<any> {
        for await (const entry of this.fs.ls(this.root)) {
            if (entry.name == 'Movies') {
                for await (const movie of this.fs.ls(entry.cid)) {
                    //TODO: fetch movie info
                    yield {
                        id: movie.name,
                        cid: movie.cid,
                    }
                }
            }
        }
    }

    getSeries() {

    }
}