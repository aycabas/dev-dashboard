import React, { CSSProperties } from "react";

import { Button, Text } from "@fluentui/react-components";
import {
    CodeTextEdit20Filled,
    MoreHorizontal32Regular,
    Search12Regular,
    Search24Filled,
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { openAIModel } from "../../models/openAIModel";
import { askOpenAI } from "../../services/openAIService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";
import { emptyLayout, emptyTextStyle, widgetPaddingStyle } from "../styles/Common.styles";
import {
    addBtnStyle,
    addTaskBtnStyle,
    addTaskContainer,
    bodyLayout,
    existingTaskLayout,
    inputCodeStyle,
} from "../styles/OpenAI.styles";

interface ITaskState {
    tasks?: openAIModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class OpenAI extends Widget<ITaskState> {
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

    async getData(): Promise<ITaskState> {
        return {
            // tasks: await getOpenAIResponse(),
            inputFocused: false,
            addBtnOver: false,
            loading: false,
        };
    }

    headerContent(): JSX.Element | undefined {
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

    bodyContent(): JSX.Element | undefined {
        const hasTask = this.state.tasks?.length !== 0;

        return (
            <div style={bodyLayout(hasTask)}>
                <TeamsFxContext.Consumer>
                    {({ themeString }) => this.inputLayout(themeString)}
                </TeamsFxContext.Consumer>

                {hasTask ? (
                    this.state.tasks?.map((item: openAIModel) => {
                        return (
                            <TeamsFxContext.Consumer key={`consumer-task-${item.text}`}>
                                {({ themeString }) => (
                                    <div
                                        key={`div-task-${item.text}`}
                                        style={existingTaskLayout(themeString)}
                                    >
                                        {item.text}
                                    </div>
                                )}
                            </TeamsFxContext.Consumer>
                        );
                    })
                ) : (
                    <div style={emptyLayout}>
                        <EmptyThemeImg key="img-empty" />
                        <Text key="text-empty" weight="semibold" style={emptyTextStyle}>
                            Open AI Code Helper will answer your questions here
                        </Text>
                    </div>
                )}
            </div>
        );
    }

    private inputLayout(themeString: string): JSX.Element | undefined {
        return (
            <div
                ref={this.inputDivRef}
                style={addTaskContainer(themeString, this.state.inputFocused)}
            >
                {this.state.inputFocused ? (
                    <Search12Regular style={addBtnStyle} />
                ) : (
                    <Search24Filled style={addBtnStyle} />
                )}

                <input
                    ref={this.inputRef}
                    type="text"
                    style={inputCodeStyle(this.state.inputFocused)}
                    onFocus={() => this.inputFocusedState()}
                    placeholder="Ask your questions to Code Helper"
                />

                {this.state.inputFocused && (
                    <button
                        style={addTaskBtnStyle(this.state.addBtnOver)}
                        onClick={() => {
                            this.onAddButtonClick();
                        }}
                        onMouseEnter={() => this.mouseEnterState()}
                        onMouseLeave={() => this.mouseLeaveState()}
                    >
                        Ask
                    </button>
                )}
            </div>
        );
    }

    customiseWidgetStyle(): CSSProperties | undefined {
        return widgetPaddingStyle;
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
                tasks: this.state.tasks,
                inputFocused: false,
                addBtnOver: this.state.addBtnOver,
                loading: false,
            });
        }
    }

    private onAddButtonClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const tasks: openAIModel[] = await askOpenAI(this.inputRef.current.value);
            this.setState({
                tasks: tasks,
                inputFocused: false,
                addBtnOver: false,
                loading: false,
            });
            this.inputRef.current.value = "";
        }
    };

    private inputFocusedState = () => {
        this.setState({
            tasks: this.state.tasks,
            inputFocused: true,
            addBtnOver: this.state.addBtnOver,
            loading: false,
        });
    };

    private mouseEnterState = () => {
        this.setState({
            tasks: this.state.tasks,
            inputFocused: this.state.inputFocused,
            addBtnOver: true,
            loading: false,
        });
    };

    private mouseLeaveState = () => {
        this.setState({
            tasks: this.state.tasks,
            inputFocused: this.state.inputFocused,
            addBtnOver: false,
            loading: false,
        });
    };
}
