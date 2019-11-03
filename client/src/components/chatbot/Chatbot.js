import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    // this.df_text_query = this.df_text_query.bind(this);

    if (cookies.get("userID") === undefined) {
      cookies.set("userID", uuid(), { path: "/" });
    }
  }

  async df_text_query(queryText) {
    let says = {
      speaks: "me",
      msg: {
        text: {
          text: queryText
        }
      }
    };
    this.setState({
      messages: [...this.state.messages, says]
    });
    try {
      const res = await axios.post("/api/df_text_query", {
        text: queryText,
        userID: cookies.get("userID")
      });

      if (res.data.fulfillmentMessages) {
        for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {
          let msg = res.data.fulfillmentMessages[i];
          let says = {
            speaks: "bot",
            msg: msg
          };
          this.setState({
            messages: [...this.state.messages, says]
          });
        }
      }
    } catch (e) {
      says = {
        speaks: "bob",
        msg: {
          text: {
            text: "I'm having trouble. I need to terminate. will be back later"
          }
        }
      };
      this.setState({
        messages: [...this.state.messages, says]
      });
    }
  }

  async df_event_query(eventName) {
    try {
      const res = await axios.post("/api/df_event_query", {
        event: eventName,
        userID: cookies.get("userID")
      });
      // if (res.data.fulfillmentMessages) {
      //   for (let i = 0; i < res.data.fulfillmentMessages.length; i++) {
      //     msg = res.data.fulfillmentMessages[i];
      //     let says = {
      //       speaks: "bot",
      //       msg: msg
      //     };
      //     this.setState({
      //       messages: [...this.state.messages, says]
      //     });
      //   }
      // }
      for (let msg of res.data.fulfillmentMessages) {
        let says = {
          speaks: "bot",
          msg: msg
        };
        this.setState({
          messages: [...this.state.messages, says]
        });
      }
    } catch (e) {
      let says = {
        speaks: "bob",
        msg: {
          text: {
            text: "I'm having trouble. I need to terminate. will be back later"
          }
        }
      };
      this.setState({
        messages: [...this.state.messages, says]
      });
    }
  }

  componentDidMount() {
    this.df_event_query("Introduction");
  }
  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "training_masterclass":
        this.df_event_query("MASTERCLASS");
        break;
      default:
        this.df_text_query(text);
    }
  }
  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.cards
    ) {
      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: "hidden" }}>
              <div className="col s2">
                <a
                  href="/"
                  className="btn-floating btn-large waves-effect waves-light red"
                >
                  {message.speaks}
                </a>
              </div>
              <div style={{ overflow: "auto", overflowY: "scroll" }}>
                <div
                  style={{
                    height: 300,
                    width:
                      message.msg.payload.fields.cards.listValue.values.length *
                      270
                  }}
                >
                  {this.renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={
            message.msg.payload.fields.text
              ? message.msg.payload.fields.text
              : null
          }
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  renderMessages(returnedMessages) {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  }
  render() {
    return (
      <div
        style={{
          height: 520,
          width: 500,
          bottom: 0,
          right: 0,
          position: "absolute",
          border: "1px solid lightgrey"
        }}
      >
        <nav className="#039be5 light-blue darken-1" margin="1px solid gray">
          <div className="nav-wrapper">
            <a href="/" className="brand-logo center">
              Chatbot
            </a>
          </div>
        </nav>

        <div
          id="chatbot"
          style={{ height: 400, width: "100%", overflow: "auto" }}
        >
          {this.renderMessages(this.state.messages)}
          <div
            ref={el => {
              this.messagesEnd = el;
            }}
            style={{ float: "left", clear: "both" }}
          ></div>
        </div>
        <div className="col s12">
          <input
            style={{
              margin: 0,
              paddingLeft: "1%",
              paddingRight: "1%",
              width: "98%",
              border: "1px solid gray",
              backgroundColor: "white"
            }}
            placeholder="type a message:"
            type="text"
            onKeyPress={this._handleInputKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default Chatbot;
