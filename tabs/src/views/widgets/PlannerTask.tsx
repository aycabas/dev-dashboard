import "../styles/PlannerTask.css";
import "../styles/Common.css";

import React from "react";

import { mergeStyles } from "@fluentui/react";
import { Avatar, Button, Checkbox, Image, Spinner, Text } from "@fluentui/react-components";
import {
    Add20Filled,
    ArrowRight16Filled,
    Circle20Regular,
    MoreHorizontal32Regular,
    Star24Regular,
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { TaskAssignedToModel, TaskModel } from "../../models/plannerTaskModel";
import { addTask, getTasks } from "../../services/plannerService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface ITaskState {
    tasks?: TaskModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class PlannerTask extends Widget<ITaskState> {
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

    protected async getData(): Promise<ITaskState> {
        return {
            tasks: await getTasks(),
            inputFocused: false,
            addBtnOver: false,
            loading: false,
        };
    }

    protected headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <TeamsFxContext.Consumer>
                    {({ themeString }) =>
                        themeString === "default" ? (
                            <Image key="icon-planner-default" width="20px" src="planner.svg" />
                        ) : (
                            <Image key="icon-planner-dark" width="20px" src="planner-dark.svg" />
                        )
                    }
                </TeamsFxContext.Consumer>
                <Text key="text-planner-title" className={widgetStyle.headerText}>
                    Team Planner Tasks
                </Text>
                <Button
                    key="bt-planner-more"
                    icon={<MoreHorizontal32Regular />}
                    appearance="transparent"
                />
            </div>
        );
    }

    protected bodyContent(): JSX.Element | undefined {
        const hasTask = this.state.tasks?.length !== 0;
        return (
            <div className={hasTask ? "has-task-layout" : "no-task-layout"}>
                {this.inputLayout()}
                {hasTask ? (
                    this.state.tasks?.map((item: TaskModel) => {
                        return (
                            <div key={`div-planner-item-${item.id}`} className="div-task-item">
                                <div
                                    key={`div-planner-${item.id}`}
                                    className="existing-task-layout"
                                >
                                    <Checkbox
                                        key={`cb-planner-${item.id}`}
                                        shape="circular"
                                        label={item.name}
                                    />
                                    <Button
                                        key={`bt-planner-${item.id}`}
                                        icon={<Star24Regular />}
                                        appearance="transparent"
                                    />
                                </div>
                                <div key={`div-assigned-item-${item.id}`} className="assign-layout">
                                    {item.assignments?.map((assignItem: TaskAssignedToModel) => {
                                        if (assignItem.userAvatar !== undefined) {
                                            return (
                                                <Avatar
                                                    key={`avatar-planner-${item.id}-${assignItem.userId}`}
                                                    className="assign-avatar"
                                                    name={assignItem.userDisplayName}
                                                    image={{
                                                        src: URL.createObjectURL(
                                                            assignItem.userAvatar
                                                        ),
                                                    }}
                                                    size={20}
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-layout">
                        <EmptyThemeImg key="img-empty" />
                        <Text key="text-empty" weight="semibold" className="empty-text">
                            Once you have a task, you'll find it here
                        </Text>
                    </div>
                )}
            </div>
        );
    }

    protected footerContent(): JSX.Element | undefined {
        if (!this.state.loading && this.state.tasks?.length !== 0) {
            return (
                <Button
                    appearance="transparent"
                    icon={<ArrowRight16Filled />}
                    iconPosition="after"
                    size="small"
                    className={widgetStyle.footerBtn}
                    onClick={() =>
                        window.open(
                            "https://tasks.office.com/m365advocates.onmicrosoft.com/en-US/Home/Planner/#/plantaskboard?groupId=c168296c-f4cf-44a2-9e27-e9ef602e8b22&planId=wIfl13Xg6UCD_d5irDOTWJgAHcUy",
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

    protected loadingContent(): JSX.Element | undefined {
        return (
            <div className="loading-layout">
                <Spinner label="Loading..." labelPosition="below" />
            </div>
        );
    }

    private inputLayout(): JSX.Element | undefined {
        return (
            <div
                ref={this.inputDivRef}
                className={mergeStyles(
                    "add-task-container",
                    this.state.inputFocused ? "focused-color" : "non-focused-color"
                )}
            >
                {this.state.inputFocused ? (
                    <Circle20Regular className="add-btn" />
                ) : (
                    <Add20Filled className="add-btn" />
                )}

                <input
                    ref={this.inputRef}
                    type="text"
                    className={mergeStyles(
                        "task-input",
                        this.state.inputFocused ? "focused-color" : "non-focused-color"
                    )}
                    onFocus={() => this.inputFocusedState()}
                    placeholder="Add a task"
                />
                {this.state.inputFocused && (
                    <button
                        className={this.state.addBtnOver ? "add-btn-enter" : "add-btn-leave"}
                        onClick={() => {
                            this.onAddButtonClick();
                        }}
                        onMouseEnter={() => this.mouseEnterState()}
                        onMouseLeave={() => this.mouseLeaveState()}
                    >
                        Add
                    </button>
                )}
            </div>
        );
    }

    protected stylingWidget(): string | React.CSSProperties {
        return "";
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
                inputFocused: false,
                addBtnOver: this.state.addBtnOver,
                loading: false,
            });
        }
    }

    private onAddButtonClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const tasks: TaskModel[] = await addTask(this.inputRef.current.value);
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
