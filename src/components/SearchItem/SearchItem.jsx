import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
// select mui imports
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// imported styles
import './SearchItem.css'
//modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// modal style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
// grid settings
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// grid item
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
// select styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function SearchItem({ item }) {
    const [frontSide, setFrontSide] = useState(true);
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    // modal settings
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    const [amountToAdd, setAmountToAdd] = useState(1);

    const addToInventory = () => {
        for (let i = 1; i <= amountToAdd; i++) {
            let cardToAdd = {
                img_url: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
                img_back_url: null,
                name: item.name,
                toughness: item.toughness ?? null,
                toughness_back: null,
                power: item.power ?? null,
                power_back: null,
                cmc: item.cmc,
                set: item.set_name,
                color_identity: item.color_identity,
                type_line: item.type_line,
                legality: item.legalities.commander,
                scryfall_id: item.id,
            }
            if (!item.image_uris) {
                cardToAdd = {
                    ...cardToAdd,
                    img_back_url: item.card_faces[1].image_uris.normal,
                }
            }
            if (item.card_faces) {
                cardToAdd = {
                    ...cardToAdd,
                    toughness: item.card_faces[0]?.toughness,
                    toughness_back: item.card_faces[1]?.toughness,
                    power: item.card_faces[0]?.power,
                    power_back: item.card_faces[1]?.power,
                }
            }
            dispatch({
                type: 'ADD_TO_INVENTORY',
                payload: cardToAdd
            })
        }
        setAmountToAdd(1);
    }

    const numbers = [];

    for (let i = 1; i < 40; i++) {
        numbers.push(i);
    }

    return (
        <div className="results">
            {!item.image_uris ?
                <>
                    <p>{item.name}</p>
                    {frontSide ?
                        <div className="searchDiv">
                            <ImageListItem key={item.id}>
                                <img className="searchFlipImg" onClick={handleOpenModal} src={item.card_faces[0].image_uris.normal} alt={item.name} />
                                <ImageListItemBar
                                    title={item.name}
                                    sx={{
                                        backgroundColor: 'grey',
                                        opacity: 1,
                                        width: 0,
                                        top: '-60%',
                                        left: '67%'
                                    }}
                                    actionIcon={
                                        <IconButton onClick={flipImage}>
                                            <AutorenewIcon
                                                fontSize="large"
                                                className="searchBtn"
                                                sx={{
                                                    color: 'white',
                                                    p: 2,
                                                }}
                                            />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </div>
                        :
                        <div>
                            <ImageListItem key={item.id}>
                                <img className="searchFlipImg" onClick={handleOpenModal} src={item.card_faces[1].image_uris.normal} alt={item.name} />
                                <ImageListItemBar
                                    title={item.name}
                                    sx={{
                                        backgroundColor: 'grey',
                                        opacity: 1,
                                        width: 0,
                                        top: '-60%',
                                        left: '67%'
                                    }}
                                    actionIcon={
                                        <IconButton onClick={flipImage}>
                                            <AutorenewIcon
                                                fontSize="large"
                                                className="searchBtn"
                                                sx={{
                                                    color: 'white',
                                                    p: 2,
                                                }}
                                            />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        </div>
                    }
                </>
                :
                <>
                    <p>{item.name}</p>
                    <img onClick={handleOpenModal} className="searchRegImg" src={item.image_uris.normal} alt={item.name} />
                </>
            }
            <br />
            {user.id &&
                <>
                    <Select
                        value={amountToAdd}
                        onChange={(event) => setAmountToAdd(event.target.value)}
                        displayEmpty
                        MenuProps={MenuProps}
                    >
                        {numbers.map((number, i) => {
                            return (
                                <MenuItem
                                    key={i}
                                    value={number}
                                >
                                    {number}
                                </MenuItem>
                            )

                        })}
                    </Select>
                    <button onClick={addToInventory}>Add to Inventory</button>
                </>
            }
            <>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div>
                        <Box sx={style}>
                            <Grid container spacing={4} columns={16}>
                                <Grid item xs={16}>
                                    <h3 className="deckImgName">{item.name}</h3>
                                </Grid>
                                <Grid item xs={8}>
                                    {!item.image_uris ?
                                        <>
                                            {frontSide ?
                                                <div className="deckItemDiv">
                                                    <ImageListItem key={item.id}>
                                                        <img
                                                            className="deckImg"
                                                            src={!item.name ?
                                                                details.deck_img
                                                                :
                                                                item?.card_faces[0]?.image_uris.normal
                                                            }
                                                            alt={item.name}
                                                        />
                                                        <ImageListItemBar
                                                            title={item.name}
                                                            sx={{
                                                                backgroundColor: 'grey',
                                                                opacity: 1,
                                                                width: 0,
                                                                top: '-61%',
                                                                left: '80%'
                                                            }}
                                                            actionIcon={
                                                                <IconButton onClick={flipImage}>
                                                                    <AutorenewIcon
                                                                        fontSize="large"
                                                                        className="deckItemBtn"
                                                                        sx={{
                                                                            color: 'white',
                                                                            p: 2,
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                </div>
                                                :
                                                <div>
                                                    <ImageListItem key={item.id}>
                                                        <img className="deckImg" src={!item.name ? details.deck_img : item?.card_faces[1]?.image_uris.normal} alt={item.name} />
                                                        <ImageListItemBar
                                                            title={item.name}
                                                            sx={{
                                                                backgroundColor: 'grey',
                                                                opacity: 1,
                                                                width: 0,
                                                                top: '-61%',
                                                                left: '80%'
                                                            }}
                                                            actionIcon={
                                                                <IconButton onClick={flipImage}>
                                                                    <AutorenewIcon
                                                                        fontSize="large"
                                                                        className="deckItemBtn"
                                                                        sx={{
                                                                            color: 'white',
                                                                            p: 2,
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                </div>
                                            }
                                        </>
                                        :
                                        <>
                                            <img className="deckImg" src={!item.name ? details.deck_img : item.image_uris.normal} alt={item.name} />
                                        </>
                                    }
                                </Grid>
                                <Grid item xs={8}>
                                    <div className="detailsContainer">
                                        <h5 className="cardDetails">Type: {item.type_line}</h5>
                                        <h5 className="cardDetails">Set: {item.set_name}</h5>
                                        <h5 className="cardDetails">Commander Legality:
                                            {item?.legalities?.commander === 'legal' ?
                                                <span> {item.legalities.commander}</span>
                                                :
                                                <span style={{ color: 'red' }}> {item?.legalities?.commander.replace(/_/g, " ")}</span>
                                            }
                                        </h5>
                                        <h5 className="cardDetails">Prices:
                                            <p className="cardDetails">Normal: ${item?.prices?.usd !== null ? item?.prices?.usd : '---'}</p>
                                            <p className="cardDetails">Foil: ${item?.prices?.usd_foil !== null ? item?.prices?.usd_foil : '---'}</p>
                                        </h5>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                </Modal>
            </>

        </div >
    )
}

export default SearchItem;