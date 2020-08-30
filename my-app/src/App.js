import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";


function IssueRow(props) {
  const issue = props.issue;
  console.log(issue.length)
  return (
    <React.Fragment>
    <li>{issue._id}</li>
     {/* <li>{issue.quizzes[0].score}</li> */}
     {/* <li>{issue.quizzes.map(quizze => <li >{quizze.score}</li>)}</li> */}

     </React.Fragment>
  );
}

class ShowTheLocation extends React.Component {


  render() {
    const { location, issues } = this.props;
    // var myObj = JSON.parse(issues[0]);
    const myJSON = JSON.parse(issues[0]);

    console.log(myJSON._id);
    // const issueRows = issues.map(issue =>
    //   <IssueRow key={issue._id} issue={issue} />
    // );
    const issueRows = issues._id;

  return( 
    <React.Fragment>
     <div>You are now at {location.pathname}</div>
     <div> {issueRows}</div>
    </React.Fragment>
     );
  }
}

const Child = withRouter(ShowTheLocation);


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {issues : []};
  }

  componentDidMount(){
    this.loadData();
  }

  async loadData(){
    const query=`query{
      issueList{
        _id
        quizzes{
          wk
          score
        }
      }
    }`;
    const response = await fetch('http://localhost:4000/graphql',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({query})
    });
    
    const result = await response.json();
    console.log(result.data.issueList)
    this.setState({issues : result.data.issueList});
    // this.setState({issues:this.state.issues})
  }
  render(){
  return (
    <Router>
      <div>
        <h2>Accounts</h2>

        <ul>
          <li>
            <Link to="/1">1</Link>
          </li>
          <li>
            <Link to="/2">2</Link>
          </li>
          <li>
            <Link to="/3">3</Link>
          </li>
        
        </ul>

        <Switch>
          <Route path="/:id">
            <Child issues={this.state.issues}/>
          </Route>
          {/* <Child path="/:id" issues={...issues}/> */}
        </Switch>
      </div>
    </Router>
  );
}
}