import React, { useEffect } from "react";
import axios from "axios";
import Link from "@material-ui/core/Link";
import { Link as LinkRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormDetail from "./Renderform";
import NewForm from "./NewForm";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { green } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    "& > span": {
      margin: theme.spacing(2)
    },
    display: "flex"
  },
  flexGrow: 1,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },

  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function ClienteDetails(props) {
  let { selectedClient, resetState } = props;
  const classes = useStyles();
  const [form, setForm] = React.useState(false);
  const [clientForm, handleClientForm] = React.useState([]);
  const [clientTasks, handleClientTasks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, handleId] = React.useState(null);

  const handleDrawerOpen = () => {
    setForm(true);
  };

  const handleDrawerClose = () => {
    setForm(false);
    handleId(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  function deleteProject() {
    axios
      .delete(process.env.REACT_APP_API_URL + `/client/${selectedClient._id}`, {
        withCredentials: true
      })
      .then(() => {
        props.handleDeleteClient();
      })
      .catch(err => {
        console.log(err);
      });
  }

  //Aproval method < ======= TEMOS QUE UTILIZA-LOS NO JobDetails

  function setAproval(taskId) {
    axios
      .post(process.env.REACT_APP_API_URL + `/task/${taskId}`, {
        aproval: "Aprovado",
        withCredentials: true
      })
      .then(response => {
        console.log(clientTasks.aproval);
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  function setDenied(taskId) {
    axios
      .post(process.env.REACT_APP_API_URL + `/task/${taskId}`, {
        aproval: "Recusado",
        withCredentials: true
      })
      .then(response => {
        console.log(clientTasks.aproval);
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (id !== selectedClient._id) {
    handleId(selectedClient._id);
    axios.get(process.env.REACT_APP_API_URL + "/form").then(responseFromApi => {
      const forms = responseFromApi.data.filter(checkClient => {
        if (checkClient.clientId === selectedClient._id) {
          return checkClient;
        }
      });
      handleClientForm(forms);
    });
  }

  if (id !== selectedClient._id) {
    handleId(selectedClient._id);
    axios.get(process.env.REACT_APP_API_URL + "/task").then(responseFromApi => {
      const task = responseFromApi.data.filter(checkClient => {
        if (checkClient.clientId === selectedClient._id) {
          return checkClient;
        }
      });
      handleClientTasks(task);
    });
  }

  return (
    <div>
      {form ? (
        <NewForm
          selectedClient={selectedClient}
          handleDrawerClose={handleDrawerClose}
        />
      ) : (
        <div>
          <div className="name d-flex">
           <h2 className="mt-2">{selectedClient.name}</h2>
           

           <Tooltip color="black" title="Delete">
            <IconButton  aria-label="delete" onClick={handleClickOpen}>
              <DeleteIcon  style={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        
          </div>
       
          <br />
          <div className="labels">
            <h3>Formulários</h3>
          
          </div>

          <br />

          {/* Random Forms*/}
          {clientForm.length > 0 ? (
            clientForm.map(({ _id }, idx) => {
              return (
                <div className="card flex-wrap col-md-3 col-sm-12 mx-md-3 mb-3 d-inline-flex flex-row justify-content-around">
                  <div className="card-body ">
                    <h5 className="card-title"> Fomulário {idx + 1} </h5>
                    <LinkRouter className="link" to={`/renderform/${_id}`}>
                      {" "}
                      Detalhes{" "}
                    </LinkRouter>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="d-inline-flex ml-4 flex-column justify-content-around">
              <Typography variant="button" display="block" gutterBottom>
                Você não tem formulários disponíveis
              </Typography>
            </div>
          )}


          <Tooltip
            className="mt-3 ml-2 "
            title="Criar novo formulário"
            aria-label="add"
            onClick={handleDrawerOpen}
          >
            <Fab color="secondary" className={classes.absolute}>
              <AddIcon />
            </Fab>
          </Tooltip>
          <br />
          <br />
       
          <div className="labels">
            <h3>Jobs</h3>
          
          </div>
          <br />

          {clientTasks.length > 0 ? (
            clientTasks.map(({ _id, aproval }, idx) => {
              return (
                
                <div className="card flex-wrap col-md-3 mx-3 d-inline-flex flex-row justify-content-around">
                <div className="card-body ">
                      <h5 className="card-title">Tarefa {idx + 1} </h5>
                      <p className="card-text">
                        <b>Status: </b>
                        {aproval}
                      </p>
                      <LinkRouter className="link" to={`/JobDetail/${_id}`}>
                        {" "}
                        Detalhes{" "}
                      </LinkRouter>
                      
                      {/* mover para o formdetail */}
                      {/* <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className={classes.margin}
                        onClick={() => setAproval(_id)}
                      >
                        Aprovar
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        className={classes.margin}
                        onClick={() => setDenied(_id)}
                      >
                        Recusar
                      </Button> */}
                    </div>
                  </div>
                
             
              );
            })
          ) : (
            <div className="d-inline-flex ml-4 flex-column justify-content-around">
              <Typography variant="button" display="block" gutterBottom>
                Você não tem tarefas
              </Typography>
            </div>
          )}
          <br />
          <br />
            
              <div className="d-flex ml-3 "> 

            <AssignmentIndIcon className="d-flex mr-1" style={{ fontSize: 30, color: "#2F6F84" }} />
            <LinkRouter className="link1" to={selectedClient.shareLink}>
                      {" "}
                      Link do cliente{" "} 
            </LinkRouter>



          </div>

          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Deletar cliente
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Tem certeza que deseja deletar cliente?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={deleteProject} color="primary">
                Deletar
              </Button>
            </DialogActions>
          </Dialog>

          <div className={classes.root}></div>

       
        </div>
      )}
    </div>
  );
}
