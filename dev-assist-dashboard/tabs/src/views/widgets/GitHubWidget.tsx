import React, { CSSProperties } from "react";

import { Button, Checkbox, Image, Text, Label } from "@fluentui/react-components";
import {
    Add20Filled,
    ArrowRight16Filled,
    Circle20Regular,
    MoreHorizontal32Regular,
    Star24Regular,
    Open16Filled,
    ChevronRight20Regular,
    Bug16Regular
} from "@fluentui/react-icons";
import { GitHubLogoIcon, LadybugSolidIcon } from "@fluentui/react-icons-mdl2";
import { TeamsFxContext } from "../../internal/context";
import { githubIssuesModel } from "../../models/githubIssuesModel";
import { getIssues, createIssue } from "../../services/githubService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { footerBtnStyle, headerContentStyle, headerTextStyle } from "../lib/Widget.styles";
import { emptyLayout, emptyTextStyle, widgetPaddingStyle } from "../styles/Common.styles";
import {
    addBtnStyle,
    addTaskBtnStyle,
    addTaskContainer,
    bodyLayout,
    existingTaskLayout,
    inputStyle,
    descriptionStyle,
} from "../styles/GitHub.styles";

interface ITaskState {
    tasks?: githubIssuesModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class GithubIssues extends Widget<ITaskState> {
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
            tasks: await getIssues(),
            inputFocused: false,
            addBtnOver: false,
            loading: false,
        };
    }

    headerContent(): JSX.Element | undefined {
        return (
            <div style={headerContentStyle}>
                <GitHubLogoIcon key={`icon-github-issues`} />
                <Text key="text-task-title" style={headerTextStyle}>
                    GitHub Repository Issues
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
                    this.state.data?.tasks?.map((item: githubIssuesModel) => {
                        return (
                            <TeamsFxContext.Consumer key={`consumer-task-${item.title}`}>
                                {({ themeString }) => (
                                    <div key={`div-task-${item.title}`} style={existingTaskLayout(themeString)} >

                                        <Text key={`cb-task-${item.title}`}
                                            onClick={() =>
                                                window.open(
                                                    item.url,
                                                    "_blank"
                                                )}>
                                            {<LadybugSolidIcon></LadybugSolidIcon>} [{item.state}] {item.title}
                                        </Text>

                                        <Button
                                            key={`bt-task-${item.title}`}
                                            icon={<Open16Filled />}
                                            onClick={() =>
                                                window.open(
                                                    item.url,
                                                    "_blank"
                                                )}
                                            appearance="transparent"
                                        />
                                        <Text key={`div-task-${item.title}`} style={descriptionStyle}>
                                            {item.body}
                                        </Text>
                                    </div>
                                )
                                }
                            </TeamsFxContext.Consumer>
                        );
                    })
                ) : (
                    <div style={emptyLayout}>
                        <EmptyThemeImg key="img-empty" />
                        <Text key="text-empty" weight="semibold" style={emptyTextStyle}>
                            Once you have a task, you'll find it here
                        </Text>
                    </div>
                )}
            </div >
        );
    }

    footerContent(): JSX.Element | undefined {
        if (!this.state.data?.loading && this.state.data?.tasks?.length !== 0) {
            return (
                <Button
                    appearance="transparent"
                    icon={<ArrowRight16Filled />}
                    iconPosition="after"
                    size="small"
                    style={footerBtnStyle}
                    onClick={() =>
                        window.open(
                            "https://github.com/aycabasDemo/ContosoProject/issues",
                            "_blank"
                        )
                    } // navigate to detailed page
                >
                    View all
                </Button>
            );
        } else {
            return undefined;
        }
    }

    private inputLayout(themeString: string): JSX.Element | undefined {
        return (
            <div
                ref={this.inputDivRef}
                style={addTaskContainer(themeString, this.state.data?.inputFocused)}
            >
                {this.state.data?.inputFocused ? (
                    <Circle20Regular style={addBtnStyle} />
                ) : (
                    <Add20Filled style={addBtnStyle} />
                )}

                <input
                    ref={this.inputRef}
                    type="text"
                    style={inputStyle(this.state.data?.inputFocused)}
                    onFocus={() => this.inputFocusedState()}
                    placeholder="Create a new issue"
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
                        Create
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
            const tasks: githubIssuesModel[] = await createIssue(this.inputRef.current.value);
            this.setState({
                data: {
                    tasks: tasks,
                    inputFocused: false,
                    addBtnOver: false,
                    loading: false,
                },
            });
            this.inputRef.current.value = "";
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
