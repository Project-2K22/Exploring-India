import React from 'react';
import {Toolbar,Stack,Divider,Box,Typography,Button,IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
    // const navBarProps = {
    //     leftFirstLinkAbout: {name: 'About', onClickFun: ()=>{console.log("From leftFirstLinkAbout")}, visible:true},
    //     leftSecondLinkContact: {name: 'Contact',onClickFun: ()=>{console.log("From leftSecondLinkContact")}, visible:true},
    //     rightFirstLinkLogin: {name: 'Login',onClickFun: ()=>{console.log("From rightFirstLinkLogin")}, visible:true},
    //     rightSecondLinkSignup: {name: 'Signup',onClickFun: ()=>{console.log("From rightSecondLinkSignup")}, visible:true},
    //     rightthirdLinkLogout: {name: 'Logout',onClickFun: ()=>{console.log("From rightthirdLinkLogout")}, visible:false},
    //     SearchIcon: {onClickFun: ()=>console.log("From SearchIcon"), visible:true},
    //     ProfileIcon: {onClickFun: ()=>console.log("From ProfileIcon"), visible:false},
    //     UserLogin:true
    // }
const NavBar = props => {

    return (
        <Box >
            <Toolbar sx={{ background:'transparent'}}>
                <Stack direction="column" justifyContent="center" alignItems="center"  width="100%">
                    <Stack mt={2} direction="row" justifyContent="space-between" alignItems="center"  width="85%">
                        <Box>
                            <Stack direction="row"justifyContent="flex-start"alignItems="center"spacing={11}>
                                {props.leftFirstLinkAbout.visible ? <Button variant="text" onClick={props.leftFirstLinkAbout.onClickFun} style={{color:"black"}}>{props.leftFirstLinkAbout.name}</Button>:""}
                                {props.leftSecondLinkContact.visible ? <Button variant="text" onClick={props.leftSecondLinkContact.onClickFun} style={{color:"black"}}>{props.leftSecondLinkContact.name}</Button>:""}
                            </Stack>
                        </Box>
                        <Box>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Exploring India
                            </Typography>
                        </Box>
                        <Box>
                            <Stack direction="row"justifyContent="flex-end"alignItems="center"spacing={7}>
                                {props.rightFirstLinkLogin.visible ? <Button variant="text"  onClick={props.rightFirstLinkLogin.onClickFun} style={{color:"black"}}>{props.rightFirstLinkLogin.name}</Button>:""}
                                {props.rightSecondLinkSignup.visible ? <Button variant="text"  onClick={props.rightSecondLinkSignup.onClickFun} style={{color:"black"}}>{props.rightSecondLinkSignup.name}</Button>:""}
                                {props.rightthirdLinkLogout.visible ? <Button variant="text"  onClick={props.rightthirdLinkLogout.onClickFun} style={{color:"black"}}>{props.rightthirdLinkLogout.name}</Button>:""}
                                {props.ProfileIcon.visible ?<IconButton onClick={props.ProfileIcon.onClickFun} aria-label="User"><AccountCircleIcon/></IconButton>:""}
                                {props.SearchIcon.visible ?<IconButton onClick={props.SearchIcon.onClickFun} aria-label="Search"><SearchIcon/></IconButton>:""}
                            </Stack>
                        </Box>
                    </Stack>
                    <Stack style={{background:"gainsboro"}} mt={2} direction="row" justifyContent="center" alignItems="center"  width="84%" pt={0.1}><Divider /></Stack>
                </Stack>
            </Toolbar>
        </Box>
    );
};

export default NavBar;
