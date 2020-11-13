const IFRAME_HOST = "*";

const IframeWrapper = ({}) => {
  const iframe = React.createRef();
  const [messages, setMessages] = React.useState([]);

  const messageListener = ({ origin, data }) => {
    if (!origin.match(/localhost:8080/) ) {
      return;
    }

    setMessages(m => m.concat(data));
  }

  React.useEffect(() => {
    window.addEventListener('message', messageListener);

    return () => { 
      window.removeEventListener('message', messageListener);
    };
  }, []);
  
  const chatInfo = {};

  return (
    <>
      <div>
        <button 
          onClick={() => {
            iframe.current.contentWindow.postMessage({ message: 'sending a message' })
          }}>
            Send message to iframe
          </button>
      </div>
      <div>
        <h3>Messages from child</h3>
        <pre>{JSON.stringify(messages, null, 2)}</pre>
      </div>
      <iframe	
        src="/iframe.html"	
        className="content-bot"	
        title="Help Chat Bot"	
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"	
        style={{
          width: '100%',
          height: '100%'
        }}
        onLoad={() =>	
          iframe.current.contentWindow.postMessage(	
            {	
              messageType: 'init',	
              chatInfo,	
              location: window.location.href,	
            },	
            IFRAME_HOST,	
          )	
        }
        ref={iframe}	
      />
    </>	
  );
}

ReactDOM.render(
  <div>
    <IframeWrapper />
  </div>,
  document.getElementById('root')
);
