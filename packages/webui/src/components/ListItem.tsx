import React from "react";
import {IconButton, ButtonGroup, Card, CardActions, CardHeader, CardMedia} from "@mui/material";

export function ListItem() {
    return <Card>
        <CardMedia/> {/* Movie Poster */}
        <CardHeader title={'TODO'}/>
        <CardActions>
            <ButtonGroup>
                <IconButton></IconButton>{/* Info */}
                <IconButton></IconButton>{/* Save/Pin */}
                <IconButton></IconButton>{/* Play */}
            </ButtonGroup>
        </CardActions>
    </Card>
}