import {Box, Toolbar} from "@mui/material";
import React from "react";
import {ConnectionStatus} from "./ConnectionStatus";
import {LanguageSelector} from "./LanguageSelector";

export function AppBar() {
    return <Box sx={{backgroundColor: 'primary'}}>
        <Toolbar>
            <ConnectionStatus/>
            <LanguageSelector/>
        </Toolbar>
    </Box>
}