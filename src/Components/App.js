import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { toast } from 'react-toastify';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import EVOLOGO from '../assets/img/logo192.png';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  grid: {
    position: 'absolute', 
    top: '50%',
    transform: 'translateY(-50%)',
  },
  paper: {
    padding: 80,
    border: '2px dashed white',
  },
  fntSize: {
    fontSize: 20,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  dialog: {
    minWidth: 600,
  },
}));

const saveConfig = (config, configname) => {
  let a = document.createElement("a");
  let file = new Blob([JSON.stringify(config, null, 2)], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = configname;
  a.click();
}

function App() {
  const classes = useStyles();
  const [luas, setLuas] = useState({});
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDrop = useCallback(acceptedFiles => {
    try {
      let reader = new FileReader();
      const configName = acceptedFiles[0].name;
      reader.onload = (event) => {
          let config = JSON.parse(event.target.result)
          if(Object.keys(config.lua).filter(lua => lua !== "input_toggle_key").length !== 0) {
            handleOpen();
            setLuas(config.lua);
            config.lua = {
                "input_toggle_key": {
                  "value": 36
              }
            };
            toast.success("Config cleaned!", {
              position: toast.POSITION.TOP_RIGHT
            });
            saveConfig(config, configName)
          } else {
            toast.success("Config doesn't have lua's!", {
              position: toast.POSITION.TOP_RIGHT
            });
          }
      };
      reader.readAsText(acceptedFiles[0]);
    } catch (err) {
      toast.error("Error !", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <>
      <>
        <Typography variant="h1" component="h2" gutterBottom>
          ev0-config-cleaner
        </Typography>
        <Typography>
          Made with <span role="img" aria-label="heart">❤️</span> by bay
        </Typography>
        <img src={EVOLOGO} alt="evo logo" />
      </>
      <Grid className={classes.grid} container justify="center">
        <Paper className={classes.paper} {...getRootProps()}>
          <input {...getInputProps()} multiple={false} accept="application/json" />
          {
            isDragActive ?
              <Typography className={classes.fntSize} variant="overline" display="block" gutterBottom>
                Drop config here
              </Typography> :
              <Typography className={classes.fntSize} variant="overline" display="block" gutterBottom>
                Drag 'n' drop config here, or click to select config
              </Typography>
          }
        </Paper>
      </Grid>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>{"Removed lua's"}</DialogTitle>
        <DialogContent className={classes.dialog}>
          <DialogContentText>
            {Object.keys(luas).filter(lua => lua !== "input_toggle_key").map(lua => {
              const luaData = luas[lua];
              return (
                <ExpansionPanel key={`${lua}-key`}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`${lua}-panel`}
                  >
                    <Typography className={classes.heading} color={luaData === null ? "error" : "" } >{lua}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <JSONPretty id={`${lua}-pretty`} data={luaData}></JSONPretty>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default App;
