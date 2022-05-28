import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseContainer from '../components/BaseContainer';
import SnackBarBox from '../components/SnackBarBox';
import { IconButton,InputAdornment,Input,Box,Stack,Avatar,Grid,Divider,Button,TextField,Typography,Modal ,FormControl,InputLabel} from '@mui/material';

//ICONS
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
// firebase
import { db,auth,storage} from '../firebase/config';
import { onAuthStateChanged,deleteUser,reauthenticateWithCredential ,EmailAuthProvider  } from 'firebase/auth';
import { getDatabase, ref, child, get, update } from "firebase/database";
import {uploadBytes,uploadBytesResumable,getDownloadURL,ref as ref_storage} from "firebase/storage";


//STYLES
const informationstyle = { color: "dimgrey", fontFamily: "Arial",fontSize: "20px",fontWeight:"Bold"};
const modelstyle = { //EDIT INFORMATION MODEL BOX STYLE 
    position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',
    width: 900,height:500,bgcolor: 'background.paper',border: '1px solid #000',
    boxShadow: 24,p: 4,borderRadius: '14px',
    };
const deletemyaccountmodelstyle = { // DELETE YOUR ACCOUNT CON MODEL BOX STYLE
    position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',
    width: '600px',height:'300px',bgcolor: 'background.paper',border: '2px solid #000',boxShadow: 24,p: 4,borderRadius: '14px',
};
const pdropdownstyle={outline:'none',padding: '5px',border: 0,backgroundColor:'transparent',fontSize: '16px',borderBottom: "1px solid rgb(212, 212, 212)",borderRadius: '10px'};


const UserProfile = () => {

//GETHERING THE DATA START
    const [uid, setUid] = React.useState("");
    const [loading, setLoading]= useState(true);
    const [uf_user_data, setUf_user_data] = React.useState(null);
    useEffect(() => {
            onAuthStateChanged(auth, user => {
            if (user) {
                const uid = user.uid;
                const dbf = ref(getDatabase());
                get(child(dbf, `users/${uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        // console.log((snapshot.val()));
                        setUf_user_data(snapshot.val());
                        setUid(uid);
                        setLoading(false);
                    } else {
                        setAlert({ visible: true, message: 'NO DATA FOUND', type: 'error' });
                    }
                }).catch((error) => {
                    const errorMessage = error.message;
                    setAlert({ visible: true, message: errorMessage, type: 'error' });
                }); 
            }
                });
    }, []);

    //GETHERING THE DATA END

    //EDIT INFO MODEL INFO START
    const [openfe, setOpenfe] = React.useState(false);
    const handleOpenfe = () => setOpenfe(true);
    const handleClosefe = () => {
        setOpenfe(false);
        window.location.reload();
    };
    //EDIT INFO MODEL INFO END


    //DELETE ACCOUNT MODEL INFO START
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpenfe(false);

    //DELETE ACCOUNT MODEL INFO END

    const [alert, setAlert] = useState({//FOR DIFFERENT TYPE OF ALERTS
        visible: false,
        message: '',
        type: '',
    });

    //PROFILE PIC UPLOAD START
    const [imageUpload, setImageUpload] = useState(null);
    const [allmessages, setAllmessages] = useState("The data will saved along with your changes"); 
    const uploadProfileImg = () => {//PROFILE PIC UPLOAD FUNTION
        if (imageUpload == null){
            setAlert({ visible: true, message: "Select a image first", type: 'error' });
            return;
        }
        const imageRef = ref_storage(storage, `profile_pictures/${imageUpload.name}`);
        setAlert({ visible: true, message: "Your profile picture start uploading", type: 'success' });


        const uploadTask = uploadBytesResumable(imageRef, imageUpload);
            uploadTask.on("state_changed",(usnapshot) => {
             setAlert({ visible: true, message: "Uploading "+(Math.round((usnapshot.bytesTransferred/usnapshot.totalBytes)*100)), type: 'success' });
            });//UPLOADING PROGRESS 

            uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setAlert({ visible: true, message: "Your profile picture is ready to update", type: 'success' });
                    update(ref(db,'users/'+uid),{
                        dplink: url
                    }).then(function(){
                        setAlert({ visible: true, message: "Profile pic Updated", type: 'success' });
                        }).catch(function(error) {
                            const errorMessage = error.message;
                            setAlert({ visible: true, message: errorMessage, type: 'error' });
                    });
            });
        });
    };//PROFILE PIC UPLOAD END



    // UPDATE DATA START HERE
    const handelUpdateChanges = () => { //UPDATING DATA MAIN FUNCTION

        handleClosefe();

    };

    const editFieldsChange = (e) => { //UPDATING DATA MAIN FUNCTION
        var nameName=e.target.name;
        if(nameName=="name"){
            update(ref(db,'users/'+uid),{
                name: e.target.value,
                }).then(function(){setAlert({ visible: true, message: "Name Updated", type: 'success' });
                }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
            });
        }
        if(nameName=="phoneno"){
            update(ref(db,'users/'+uid),{
                phoneno: e.target.value,
                }).then(function(){setAlert({ visible: true, message: "Phoneno Updated", type: 'success' });
                }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
            });
        }
        if(nameName=="age"){
            update(ref(db,'users/'+uid),{
                age: e.target.value,
                }).then(function(){setAlert({ visible: true, message: "Age Updated", type: 'success' });
                }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
            });
        }
        if(nameName=="gender"){
            update(ref(db,'users/'+uid),{
                gender: e.target.value,
                }).then(function(){setAlert({ visible: true, message: "Gender Updated", type: 'success' });
                }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
            });
        }

    };
    //UPDATE DATA END HERE
    const gohome = () => {
    navigate('/home')
      };
    //DELETE THE USER START 

      const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

const navigate = useNavigate();
    const deleteTheUser = () =>{
        const password=(values.password).trim()
        if(password==""){
            setAlert({ visible: true, message: "Enter the password", type: 'error' })
        }else{
            const duser = auth.currentUser;
            const  email  = duser.email;
            const credential = EmailAuthProvider.credential(email, password);
            reauthenticateWithCredential(duser, credential).then(() => {
              // User re-authenticated.
              setAlert({ visible: true, message: "Verified! We are sad to let you go", type: 'info' })
                      deleteUser(duser).then(() => {
                        navigate('/signup');
                          setAlert({ visible: true, message: "Account Deleted", type: 'erroe' })
                          
                        }).catch((error) => {
                            setAlert({ visible: true, message: "ERROR OCCERS", type: 'erroe' })
                        });
            }).catch((error) => {
                setAlert({ visible: true, message: "Incorrect credential", type: 'error' })
            });

        }


    };
    //DELETE THE USER END

    var myowncounterstart=0;
    var myowncounterend=0;
    //USER PREFERANCE EDIT START


    const handlePreferenecChange = (e) => {
    if(e.target.id=='whattype'){
        update(ref(db,'users/'+uid),{
            placesUserLike: e.target.value,
            }).then(function(){setAlert({ visible: true, message: "Data Updated", type: 'success' });
            }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
        });
    }
    if(e.target.id=='whatkindoft'){
        update(ref(db,'users/'+uid),{
            lengthOfTrip: e.target.value,
            }).then(function(){setAlert({ visible: true, message: "Data Updated", type: 'success' });
            }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
        });
    }
    if(e.target.id=='outsidestate'){
        update(ref(db,'users/'+uid),{
            wantToVisitPlacesOtherStates: e.target.value,
            }).then(function(){setAlert({ visible: true, message: "Data Updated", type: 'success' });
            }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
        });
    }
    if(e.target.id=='whatweather'){
        update(ref(db,'users/'+uid),{
            favouriteSeason: e.target.value,
            }).then(function(){setAlert({ visible: true, message: "Data Updated", type: 'success' });
            }).catch(function(error) {const errorMessage = error.message;setAlert({ visible: true, message: errorMessage, type: 'error' });
        });
    }
    };

    const lengthOfTripArr=["long","short","depends on you"];
    const whattypeArr=['Mountain', 'Beach', 'Desert', 'Heritage'];
    const outsidestateArr=['Yes', 'No'];
    const whatweatherArr=  ['Summer', 'Winter', 'Spring', 'Autumn', 'Rain'];
    //USER PREFERANCE EDIT END HERE
    return (
        <div>
        {loading ? "Loading... ":

      <BaseContainer w="lg" >
        {/*MAIN PAGE DEGINE START HERE*/}
        <Stack height="100vh" p={11} direction="row"  spacing={0} justifyContent="center" alignItems="center" >
            <SnackBarBox alert={alert} setAlert={setAlert} />
            <Box sx={{boxShadow: 3,width: '45%',height: '100%'  ,background: 'linear-gradient(to right, #ea5b6c, #ec6667, #ec7263, #ec7d61, #eb8860)',borderBottomLeftRadius: '13px',borderTopLeftRadius: '13px'}}>      
                <Stack spacing={0} justifyContent="center" alignItems="center" height='100%'>

                  <Box sx={{width: '100%',height: '40%'  ,}}>
                    <Grid container justifyContent="center" alignItems="center" height="100%">
                      <Avatar alt="Remy Sharp" src={uf_user_data.dplink}sx={{  width: 140, height: 140 }} />
                    </Grid>
                  </Box> 

                  <Box sx={{width: '100%',height: '55%'  }}>   
                    <Stack spacing={6}  alignItems="center" height="100%">
                      <Typography variant="h4">{uf_user_data.name}</Typography>
                      <Button variant="contained" color="info" onClick={handleOpenfe} >EDIT</Button> {/*OPEN THE EDIT MODEL BUTTON*/}
                    <Button variant="contained" color="success" startIcon={<HomeIcon />} onClick={gohome}> Go Home</Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleOpen}> Delete</Button>
                    </Stack>
                  </Box> 

                </Stack>
            </Box>

            <Box sx={{boxShadow: 5,width: '100%',height: '100%'  ,backgroundColor: '#f9f9fa',borderBottomRightRadius: '13px',borderTopRightRadius: '13px'}}>
                <Stack   p={2} pb={0}>
                    <h2>Information</h2>
                    <Divider /><Divider />

                    <Stack direction="row" justifyContent="space-around" alignItems="flex-start" spacing={1}>
                        <Box>
                           <Stack direction="column" justifyContent="space-evenly" alignItems="flex-start" spacing={0}>
                           <h3>Email</h3>
                            <Typography variant="h3" style={informationstyle}>{uf_user_data.email}</Typography>
                            </Stack>
                        </Box>
                        <Box>
                           <Stack direction="column" justifyContent="space-evenly" alignItems="flex-start" spacing={0}>
                           <h3 p={0} >Phone No</h3>
                           <Typography variant="h3" style={informationstyle}>{uf_user_data.phoneno== -1 ? "**********" :uf_user_data.phoneno}</Typography>
                            </Stack>
                        </Box>
                        
                    </Stack>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-start" spacing={1}>
                        <Box>
                           <Stack direction="column" justifyContent="space-evenly" alignItems="flex-start" spacing={0}>
                           <h3>Age</h3>
                            <Typography variant="h3" style={informationstyle}>{uf_user_data.age== -1 ? "***" :uf_user_data.age}</Typography>
                            </Stack>
                        </Box>
                        <Box>
                           <Stack direction="column" justifyContent="space-evenly" alignItems="flex-start" spacing={0}>
                           <h3 >Gender</h3>
                           <Typography variant="h3" style={informationstyle}>{uf_user_data.gender== -1 ? "****" :uf_user_data.gender}</Typography>
                            </Stack>
                        </Box>
                        
                    </Stack>
                </Stack>


                <Stack p={2} pt={0}>
                    <h2>Preferances</h2>
                    <Divider />
                    <Divider />

                    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2} p={2} >
                        <Box>
                           <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={20} width="100%">
                           <Typography variant="p" >Which type of places you like to visit?</Typography>
                                <Box>
                                    <select name="whattype" id="whattype" style={pdropdownstyle} onChange={handlePreferenecChange}>
                                    {whattypeArr.map((val) => {
                                        const fromArrVal = val;
                                        const user_lengthOfTrip=(uf_user_data.placesUserLike)
                                            if(myowncounterstart==0){myowncounterend=whattypeArr.length}
                                            myowncounterstart=myowncounterstart+1;

                                            if(val.toLowerCase()!=user_lengthOfTrip.toLowerCase()){
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option value={val} key={val}>{val.toUpperCase()}</option>);
                                            }

                                            else{
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option selected value={user_lengthOfTrip} key={user_lengthOfTrip}>{user_lengthOfTrip.toUpperCase()}</option>);
                                            }
                                        }
                                    )}
                                    </select>
                                </Box>
                            </Stack>
                        </Box>
                        <Box>
                           <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={20} width="100%">
                                <Typography variant="p" >What kind of trip you want to do?</Typography>
                                <Box>
                                    <select name="whatkindoft" id="whatkindoft" style={pdropdownstyle} onChange={handlePreferenecChange}>
                                    {lengthOfTripArr.map((val) => {
                                        const fromArrVal = val;
                                        const user_lengthOfTrip=(uf_user_data.lengthOfTrip)
                                            if(myowncounterstart==0){myowncounterend=lengthOfTripArr.length}
                                            myowncounterstart=myowncounterstart+1;

                                            if(val.toLowerCase()!=user_lengthOfTrip.toLowerCase()){
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option value={val} key={val}>{val.toUpperCase()}</option>);
                                            }

                                            else{
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option selected value={user_lengthOfTrip} key={user_lengthOfTrip}>{user_lengthOfTrip.toUpperCase()}</option>);
                                            }
                                        }
                                    )}
                                    </select>
                                </Box>
                            </Stack>
                        </Box>
                        <Box>
                           <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={20} width="100%">
                           <Typography variant="p" >Do you like to visit place outside your state?</Typography>
                                <Box>
                                    <select name="outsidestate" id="outsidestate" style={pdropdownstyle} onChange={handlePreferenecChange} >
                                    {outsidestateArr.map((val) => {
                                        const fromArrVal = val;
                                        const user_lengthOfTrip=(uf_user_data.wantToVisitPlacesOtherStates)
                                            if(myowncounterstart==0){myowncounterend=outsidestateArr.length}
                                            myowncounterstart=myowncounterstart+1;

                                            if(val.toLowerCase()!=user_lengthOfTrip.toLowerCase()){
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option value={val} key={val}>{val.toUpperCase()}</option>);
                                            }

                                            else{
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option selected value={user_lengthOfTrip} key={user_lengthOfTrip}>{user_lengthOfTrip.toUpperCase()}</option>);
                                            }
                                        }
                                    )}
                                    </select>
                                </Box>
                            </Stack>
                        </Box>
                        <Box>
                           <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={20} width="100%">
                           <Typography variant="p" >Which weather is favourite to you for trip?</Typography>
                                <Box>
                                    <select name="whatweather" id="whatweather" style={pdropdownstyle} onChange={handlePreferenecChange}>
                                    {whatweatherArr.map((val) => {
                                        const fromArrVal = val;
                                        const user_lengthOfTrip=(uf_user_data.favouriteSeason)
                                            if(myowncounterstart==0){myowncounterend=whatweatherArr.length}
                                            myowncounterstart=myowncounterstart+1;

                                            if(val.toLowerCase()!=user_lengthOfTrip.toLowerCase()){
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option value={val} key={val}>{val.toUpperCase()}</option>);
                                            }

                                            else{
                                                if(myowncounterstart==myowncounterend){myowncounterstart=0}
                                                return(<option selected value={user_lengthOfTrip} key={user_lengthOfTrip}>{user_lengthOfTrip.toUpperCase()}</option>);
                                            }
                                        }
                                    )}
                                    </select>
                                </Box>
                            </Stack>
                        </Box>

                        
                    </Stack>
                
                </Stack>
            </Box>        
        </Stack>
        {/*MAIN PAGE DEGINE END HERE*/}

        {/*DELETE ACCOUNT CONFIRMATION MODEL START HERE*/}
        <Modal open={open}onClose={handleClose}aria-labelledby="modal-modal-title"aria-describedby="modal-modal-description">
            <Box sx={deletemyaccountmodelstyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                We need to verify you to delete your account..!
                </Typography>
                <FormControl sx={{ mt: 5,pt:5, width: '100%' }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Stack direction="row" justifyContent="space-around" p={4}  alignItems="center" spacing={1}>
                        {/*<h3 style={informationstyle} > More info :- ******< /h3>*/}
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={deleteTheUser}> Verify and Delete </Button>
                    <Button variant="contained" color="success" startIcon={<CancelIcon />} onClick={handleClose}> Cancel </Button>
                </Stack>
            </Box>
        </Modal>
        {/*DELETE ACCOUNT CONFIRMATION MODEL END HERE*/}




        {/*EDIT PAGE MODEL START HERE*/}
        <Modal open={openfe} onClose={handleClosefe} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
            <Box sx={modelstyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit your information
                </Typography>
                <Stack spacing={2} p={3} height='100%' direction="column" justifyContent="space-evenly" alignItems="stretch">
                    <Typography  sx={{ mt: 2 }} id="messeges">
                    {allmessages}
                    </Typography>
                    <TextField name="name" id="standard-basic" label="Required" label="Name" variant="standard" defaultValue = {uf_user_data.name==''? "***":uf_user_data.name} 
                                        onChange={editFieldsChange}/>
                    <TextField name="phoneno" id="standard-basic" label="Required" type="number" label="Phone No" variant="standard" defaultValue={uf_user_data.phoneno==-1? "***":uf_user_data.phoneno}
                                        onChange={editFieldsChange} />
                    <TextField name="age" id="standard-basic" label="Required" type="number" label="Age" variant="standard" defaultValue={uf_user_data.age==-1? "***":uf_user_data.age}
                                        onChange={editFieldsChange}                                         />
                    <TextField name="gender" id="standard-basic" label="Required" label="Gender" variant="standard" defaultValue={uf_user_data.gender==-1? "***":uf_user_data.gender}
                                        onChange={editFieldsChange}
                    />
                    <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={2}>
                         <input type="file" onChange={(event) => {setImageUpload(event.target.files[0]);}}/>
                        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={uploadProfileImg}> Update Picture </Button>
                        <Button variant="contained" color="warning" startIcon={<CancelIcon />} onClick={handelUpdateChanges}> Close </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
        {/*EDIT PAGE MODEL END HERE*/}
      </BaseContainer>
      }
        </div>
    );
};

export default UserProfile;
