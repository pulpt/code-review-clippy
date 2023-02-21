export const style = `
body {
	background: black;
    width: 90%;
}

.container {
    display: flex;
    flex-flow: column;
    justify-items: flex-end;
    position: relative;
    top: 2em;
    left: 2em;
    right: 2em;
    bottom: 2em;
    min-height: 40%;
}

.message {
    font-size: 2em;
    position: relative;
    background: #feffc6;
    width: 100%;
    max-width: fit-content;
    min-width: 60vw;
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
}

.image {
    max-height: 50%;
    margin-top: 10em;
    margin-left: auto;
}
`;