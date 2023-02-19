export const style = `
body {
	background: black;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 40em;
    grid-gap: 6em;
    position: absolute;
    top: 1em;
    left: 1em;
    right: 1em;
    bottom: 1em;
    justify-items: flex-end;
    margin-left: 2em;
    margin-right: 2em;
}

.message {
    font-size: 2em;
    position: relative;
    background: #feffc6;
    width: 100%;
    max-width: fit-content;
    min-width: 80vw;
    border-radius: 1em;
    color: black;
    padding: 2em;
    box-shadow: 0px 2px 2px 3px #dadada;
    white-space: pre-line;
}

.message:after {
    content:'';
    position: absolute;
    top: 100%;
    left: 75%;
    margin-left: -50px;
    width: 0;
    height: 0;
    border-top: solid 50px #feffc6;
    border-left: solid 50px transparent;
    border-right: solid 50px transparent;
`;