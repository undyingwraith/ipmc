import {useTranslation} from "react-i18next";
import {Button, IconButton, Popover, Stack} from "@mui/material";
import React, {useState} from "react";
import LanguageIcon from '@mui/icons-material/Language';

export function LanguageSelector() {
    const {i18n} = useTranslation()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang: string | undefined = undefined) => {
        if (lang) {
            i18n.changeLanguage(lang)
        }
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return <>
        <IconButton onClick={handleClick}>
            <LanguageIcon/>
        </IconButton>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => handleClose()}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Stack>
                <Button onClick={() => handleClose('en')}>
                    English
                </Button>
                <Button onClick={() => handleClose('de')}>
                    Deutsch
                </Button>
            </Stack>
        </Popover>
    </>
}