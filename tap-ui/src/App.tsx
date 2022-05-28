import React, {Component} from 'react';
import './App.css';
import {Button, Stack, TextField} from "@mui/material";
import {getDb} from "./Database";

interface IProps {
}

interface IState {
    chatData?: any;
    message: string;
}

class App extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            chatData: [],
            message: ''
        }
    }

    async componentDidMount() {
        await this.onFetch();
    }

    public onSend = async() => {
        await getDb().then(
            (database:any) => database.chats.upsert({
                message_id: Date.now().toString(),
                message: this.state.message
            })
        );

        await this.onFetch();

        console.log('m: ', this.state.message)
    }

    public onFetch = async() => {
        await getDb().then(async (database:any) => {
                database.chats.find().exec().then(
                    (chatData:any) => this.setState({chatData}, () => {
                        console.log('fetched', chatData);
                    })
                );
            }
        );
    }

    render() {
        const {chatData} = this.state
        return (
            <div className="App">
                <Stack spacing={2}>
                    <TextField id="outlined-basic" label="Message" variant="outlined" value={this.state.message}
                               onChange={e => this.setState({message: e.target.value})}/>
                    <Button variant="outlined" onClick={this.onSend}>Send message</Button>
                    <Button variant="outlined" onClick={this.onFetch}>Fetch data</Button>
                    {chatData?.map((e:any) => {
                        return (<div id={e.message_id}>{e.message}</div>);
                    })}
                </Stack>
            </div>
        )
    }
}
export default App;
