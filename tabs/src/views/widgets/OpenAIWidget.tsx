import "../styles/OpenAI.css";
import "../styles/Common.css";

import React from "react";

import { Button, Image, Text } from "@fluentui/react-components";
import {
    CodeTextEdit20Filled,
    DismissCircle24Regular,
    MoreHorizontal32Regular,
    Send24Regular,
} from "@fluentui/react-icons";

import { openAIModel } from "../../models/openAIModel";
import { askOpenAI } from "../../services/openAIService";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface IOpenAIState {
    answer?: openAIModel[];
    inputFocused?: boolean;
}

export class OpenAI extends Widget<IOpenAIState> {
    inputDivRef;
    btnRef;
    inputRef;

    constructor(props: any) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.inputDivRef = React.createRef<HTMLDivElement>();
        this.btnRef = React.createRef<HTMLButtonElement>();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    protected async getData(): Promise<IOpenAIState> {
        return {
            inputFocused: false,
        };
    }

    protected headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <CodeTextEdit20Filled />
                <Text key="text-task-title" className={widgetStyle.headerText}>
                    Open AI Code Helper
                </Text>
                <Button
                    key="bt-task-more"
                    icon={<MoreHorizontal32Regular />}
                    appearance="transparent"
                />
            </div>
        );
    }

    protected bodyContent(): JSX.Element | undefined {
        const hasAnswer = this.state.answer !== undefined;
        return (
            <div className="ai-layout">
                <div ref={this.inputDivRef} className="question-input-layout">
                    <div className="question-input-content">
                        <input
                            ref={this.inputRef}
                            type="text"
                            className="question-input"
                            onFocus={() => this.inputFocusedState()}
                            placeholder="Ask your questions to Code Helper"
                        />
                        {this.state.inputFocused && (
                            <Button
                                key={`bt-question-clear`}
                                className="question-clear-btn"
                                icon={<DismissCircle24Regular />}
                                onClick={() => this.clearQuestion()}
                                appearance="transparent"
                            />
                        )}
                    </div>
                    <Button
                        key={`bt-question-send`}
                        icon={<Send24Regular />}
                        onClick={() => this.onSendButtonClick()}
                        appearance="transparent"
                    />
                </div>
                {hasAnswer ? (
                    <div className="answer-layout">
                        {this.state.answer?.map((item: openAIModel) => {
                            return item.isCode ? <code><pre>{item.text}</pre></code> : <pre>{item.text}</pre>;
                        })}
                    </div>
                ) : (
                    <div className="empty-layout">
                        <Image src="open-ai-empty.svg" className="empty-img" />
                    </div>
                )}
            </div>
        );
    }

    protected stylingWidget(): string | React.CSSProperties {
        return "open-ai-widget";
    }

    async componentDidMount() {
        super.componentDidMount();
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    private handleClickOutside(event: any) {
        if (!this.inputDivRef.current?.contains(event.target)) {
            this.setState({
                answer: this.state.answer,
                inputFocused: false,
            });
            this.clearQuestion();
        }
    }

    private onSendButtonClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const answer: openAIModel[] = await askOpenAI(this.inputRef.current.value);
            this.setState({
                answer: answer,
                inputFocused: false,
            });
            this.clearQuestion();
        }
    };

    private clearQuestion() {
        if (this.inputRef.current) {
            this.inputRef.current.value = "";
        }
        this.setState({
            inputFocused: false,
        });
    }

    private inputFocusedState = () => {
        this.setState({
            inputFocused: true,
        });
    };
}
