import React from 'react'
import {Button, Container, Stack, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

export function StartConfiguration() {
    const [_t] = useTranslation()

    return <Container>
        <Stack spacing={2}>
            <TextField label={_t('SwarmKey')} multiline={true}/>
            <TextField label={_t('Bootstrap')}/>
            <Button>Start</Button>
        </Stack>
    </Container>
}