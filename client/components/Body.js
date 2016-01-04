/*
  Body
*/

var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');
var CodeMirror = require('./CodeMirror');
var Analysis = require('./Analysis');

var Body = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      modalIsOpen: false,
      equation: ''
    };
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  getCode: function(newCode) {
    $.ajax({
      type: 'POST',
      url: '/parse/integers',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({data: newCode}),
      success: function(data) {
        console.log('Incoming evaluation for ' + data.name);

        var coords = JSON.parse(data.coords);
        var equation = data.eq;
        var theta = data.bigO;

        console.log(equation);
        console.log(coords);
        console.log(theta);

        this.setState({
          data: coords,
          equation: equation,
          theta: theta
        });
      }.bind(this),
      error: function(err) {
        console.error('Oups! You have a ' + err.status + ' error.' + err.responseText);
        this.setState({modalIsOpen: true});
      }.bind(this)
    });
  },

  render: function() {
    var style = {
      container: {
        backgroundColor: '#f4f4f4',
        color: 'rgba(33, 33, 33, 0.8)',
        paddingTop: '13.4rem',
        paddingBottom: '7rem',
        paddingLeft: '30rem',
        paddingRight: '30rem',
      },
      intro: {
        fontSize: '2rem',
        paddingBottom: '4rem',
        textAlign: 'center'
      }
    };
    var styleModal ={
      overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
      },
      content : {
        position              : 'absolute',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border                     : '1px solid #ccc',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '4px',
        outline                    : 'none',
        padding                    : '20px'
      }
    }

    return (
      <div style={style.container}>
        <p id="intro-message" style={style.intro}>{ this.props.intro }</p>
        <CodeMirror getCode={this.getCode} />
        { this.state.data.length ? <Analysis data={this.state.data} equation={this.state.equation} theta={this.state.theta} /> : <span /> }
        { this.state.modalIsOpen ?
          <div>
            <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={styleModal} >
              <p>"Error! Your function doesn't sort."</p>
              <button onClick={this.closeModal}>close</button>
            </Modal>
          </div> : <span />
        }
      </div>
    )
  }
});

module.exports = Body;
