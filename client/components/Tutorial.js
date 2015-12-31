/*
  Tutorial
*/

var React = require('react');
var Modal = require('react-modal');

var Tutorial = React.createClass({
  getInitialState: function() {
    return {
      modalIsOpen: false
    };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render: function() {
    var style = {
      overlay : {
        position          : 'fixed',
        zIndex            : 1000,
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(0, 0, 0, 0.3)'
      },
      content : {
        position                   : 'absolute',
        background                 : '#fffdfd',
        boxShadow                  : '0 0.25rem 0.4rem rgba(0, 0, 0, 0.24)',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '0.2rem',
        outline                    : 'none',
        padding                    : '2rem',
        display                    : 'flex',
        flexDirection              : 'column',
        justifyContent             : 'center',
        alignItems                 : 'center',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        width                 : '50rem',
        heigth                : '50rem',
        fontSize              : '1.5rem',
        transform             : 'translate(-50%, -50%)',
      },
      heading: {
        marginBottom: '2rem',
        color: 'rgba(33, 33, 33, 0.7)'
      },
      p: {
        marginBottom: '1rem'
      },
      button: {
        backgroundColor: 'rgba(33, 33, 33, 0.7)',
        border: '1rem',
        borderRadius: '0.2rem',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0 0.1rem 0.6rem, rgba(0, 0, 0, 0.239216) 0 0.1rem 0.4rem',
        color: '#fffdfd',
        cursor: 'pointer',
        fontFamily: 'Roboto',
        fontSize: '1.4rem',
        fontWeight: 500,
        lineHeight: '3.6rem',
        marginTop: '1.6rem',
        width: '10rem',
        outline: 'none',
        padding: '0 1.6rem',
        textAlign: 'center',
        textTransform: 'uppercase',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
      }
    };

    return (
      <div>
        <span className="btn-tutorial" onClick={this.openModal}>
          how to plex
        </span>
        <Modal className="modal-tutorial" style={style} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
          <h2 style={style.heading}>How to use plex:</h2>
          <div>
            <p style={style.p}>To use plex properly, the algorithm submitted must abide by the following guidelines:</p>
            <ul>
              <li>It must be a single function with one parameter. All helper functions must be enclosed within this one function.</li>
              <li>The parameter must be an array composed of integers.</li>
              <li>We do not report data for algorithms that are egregiously slow.</li>
            </ul>
            <br/>
            <p>*Note: All data reported are estimations. Use at your own risk.</p>
          </div>
          <button style={style.button} onClick={this.closeModal}>Got it</button>
        </Modal>
      </div>
    );
  }
});

module.exports = Tutorial;
