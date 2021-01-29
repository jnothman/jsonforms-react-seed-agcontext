import { Fragment, useState, useEffect } from 'react';
import { JsonForms, JsonFormsDispatch } from '@jsonforms/react';
import { rankWith, isControl } from '@jsonforms/core';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from './logo.svg';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import GrowthStageControl from './GrowthStageControl';
import growthStageControlTester from './growthStageControlTester';
import { makeStyles } from '@material-ui/core/styles';
import pointer from 'json-pointer';

const useStyles = makeStyles((_theme) => ({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto',
    display: 'block',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
}));

const initialData = {};


const TooltipControl = (props: any) => {
  // Get the description from the JSONSchema...
  // XXX: there must be a neater way to derive this from the uischema scope!
  var scopeSchema;
  try {
    scopeSchema = pointer.get(props.schema, props.uischema.scope.substring(1))
  } catch (error) {
  }
  return(
<div>
  <JsonFormsDispatch
    {...props}
    renderers={materialRenderers}
  />
  <Tooltip title={scopeSchema?.description}><div style={{float: "right", width: "2em"}}>?</div></Tooltip>
</div>)};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: growthStageControlTester, renderer: GrowthStageControl },
  // { tester: rankWith(Number.MAX_VALUE, isControl), renderer: TooltipControl },
];

const App = () => {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState('');
  const [jsonformsData, setJsonformsData] = useState<any>(initialData);

  useEffect(() => {
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, [jsonformsData]);

  const clearData = () => {
    setJsonformsData({});
  };

  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to JSON Forms with React</h1>
          <p className='App-intro'>More Forms. Less Code.</p>
        </header>
      </div>

      <Grid
        container
        justify={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={6}>
          <Typography variant={'h3'} className={classes.title}>
            Bound data
          </Typography>
          <div className={classes.dataContent}>
            <pre id='boundData'>{displayDataAsString}</pre>
          </div>
          <Button
            className={classes.resetButton}
            onClick={clearData}
            color='primary'
            variant='contained'
          >
            Clear data
          </Button>
        </Grid>
        <Grid item sm={6}>
          <Typography variant={'h3'} className={classes.title}>
            Rendered form
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={jsonformsData}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setJsonformsData(data)}
            />
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
