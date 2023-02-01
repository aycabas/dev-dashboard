import React, { CSSProperties } from "react";

import { Button, Text } from "@fluentui/react-components";
import {

    CodeTextEdit20Filled,
    MoreHorizontal32Regular,
    Search12Regular,
    Search24Filled
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { DevOpsModel } from "../../models/devOpsModel";
import { DevOpsSearch } from "../../services/devopsService";
import { callFunction } from "../../services/callFunction";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { headerContentStyle, headerTextStyle } from "../lib/Widget.styles";
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
    tasks?: DevOpsModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class DevOps extends Widget<ITaskState> {
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
            <div style={headerContentStyle}>
                <CodeTextEdit20Filled />
                <Text key="text-task-title" style={headerTextStyle}>
                    DevOps Work Items Search
                </Text>
                <Button key="bt-task-more" icon={<MoreHorizontal32Regular />} appearance="transparent" />
            </div>
        );
    }

    bodyContent(): JSX.Element | undefined {
        const loading: boolean = !this.state.data || (this.state.data.loading ?? true);
        const hasTask = this.state.data?.tasks?.length !== 0;

        return (
            <div style={bodyLayout(hasTask)}>
                <TeamsFxContext.Consumer>
                    {({ themeString }) => this.inputLayout(themeString)}
                </TeamsFxContext.Consumer>

                {loading ? (
                    <></>
                ) : hasTask ? (
                    this.state.data?.tasks?.map((item: DevOpsModel) => {


                        return (

                            <TeamsFxContext.Consumer key={`consumer-task-${item.properties[0].Title}`}>
                                {({ themeString }) => (

                                    <div key={`div-task-${item.properties[0].Title}`} style={existingTaskLayout(themeString)}>
                                        {item.properties[0].Title}
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
                style={addTaskContainer(themeString, this.state.data?.inputFocused)}
            >
                {this.state.data?.inputFocused ? (
                    <Search12Regular style={addBtnStyle} />
                ) : (
                    <Search24Filled style={addBtnStyle} />
                )}

                <input
                    ref={this.inputRef}
                    type="text"
                    style={inputCodeStyle(this.state.data?.inputFocused)}
                    onFocus={() => this.inputFocusedState()}
                    placeholder="Search DevOps Work Items"
                />

                {this.state.data?.inputFocused && (
                    <button
                        style={addTaskBtnStyle(this.state.data?.addBtnOver)}
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
                data: {
                    tasks: this.state.data?.tasks,
                    inputFocused: false,
                    addBtnOver: this.state.data?.addBtnOver,
                    loading: false,
                },
            });
        }
    }

    private onAddButtonClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const tasks: DevOpsModel[] = await DevOpsSearch(this.inputRef.current.value);
            this.setState({
                data: {
                    tasks: tasks,
                    inputFocused: false,
                    addBtnOver: false,
                    loading: false,
                },
            });
            this.inputRef.current.value = "";
            callFunction(this.inputRef.current.value);
        }
    };

    private inputFocusedState = () => {
        this.setState({
            data: {
                tasks: this.state.data?.tasks,
                inputFocused: true,
                addBtnOver: this.state.data?.addBtnOver,
                loading: false,
            },
        });
    };

    private mouseEnterState = () => {
        this.setState({
            data: {
                tasks: this.state.data?.tasks,
                inputFocused: this.state.data?.inputFocused,
                addBtnOver: true,
                loading: false,
            },
        });
    };

    private mouseLeaveState = () => {
        this.setState({
            data: {
                tasks: this.state.data?.tasks,
                inputFocused: this.state.data?.inputFocused,
                addBtnOver: false,
                loading: false,
            },
        });
    };
}
