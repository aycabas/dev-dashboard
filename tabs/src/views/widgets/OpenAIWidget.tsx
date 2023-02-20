import "../styles/OpenAI.css";
import "../styles/Common.css";

import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

import { Button, Image, Spinner, Text } from "@fluentui/react-components";
import {
    CodeTextEdit20Filled,
    Copy24Regular,
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
    onRequest?: boolean;
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
            onRequest: false,
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
                            disabled={this.state.onRequest === true ? true : false}
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
                    {this.state.onRequest === true ? (
                        <Spinner size="tiny" />
                    ) : (
                        <Button
                            key={`bt-question-send`}
                            icon={<Send24Regular />}
                            onClick={() => this.onSendButtonClick()}
                            appearance="transparent"
                        />
                    )}
                </div>
                {hasAnswer ? (
                    <div className="answer-layout">
                        {this.state.answer?.map((item: openAIModel) => {
                            return item.isCode ? this.codeBlock(item.text) : <pre>{item.text}</pre>;
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

    private codeBlock = (text?: string): JSX.Element => {
        return (
            <div className="code-block">
                <Button
                    key="btn-copy"
                    className="btn-copy"
                    appearance="transparent"
                    icon={<Copy24Regular />}
                    onClick={() =>
                        navigator.clipboard
                            .writeText(text!)
                            .catch(() => this.fallbackCopyTextToClipboard(text!))
                    }
                >
                    Copy
                </Button>
                <SyntaxHighlighter>{text!}</SyntaxHighlighter>
            </div>
        );
    };

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
            this.setState({ onRequest: true, inputFocused: false, answer: undefined });
            const answer: openAIModel[] = await askOpenAI(this.inputRef.current.value);
            this.setState({
                answer: answer,
                inputFocused: false,
                onRequest: false,
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

    fallbackCopyTextToClipboard(text: string) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
        } catch (err) {}

        document.body.removeChild(textArea);
    }
}
