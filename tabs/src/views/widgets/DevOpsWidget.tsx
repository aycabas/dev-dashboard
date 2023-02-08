import "../styles/DevOps.css";

import React from "react";

import { Button, Image, Spinner, Text } from "@fluentui/react-components";
import {
    CodeTextEdit20Filled,
    MoreHorizontal32Regular,
    Search24Regular,
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { DevOpsModel } from "../../models/devOpsModel";
import { DevOpsSearch, DevOpsSearchMock } from "../../services/devopsService";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface IWorkItemState {
    workItems?: DevOpsModel[];
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class DevOps extends Widget<IWorkItemState> {
    inputDivRef;
    inputRef;

    constructor(props: any) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.inputDivRef = React.createRef<HTMLDivElement>();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    protected async getData(): Promise<IWorkItemState> {
        return {
            workItems: await DevOpsSearchMock(),
            inputFocused: false,
        };
    }

    protected headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <CodeTextEdit20Filled />
                <Text key="text-task-title" className={widgetStyle.headerText}>
                    DevOps Work Items Search
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
        const hasWorkItem =
            this.state.workItems !== undefined && this.state.workItems?.length !== 0;
        return (
            <div className="devops-body-layout">
                <div ref={this.inputDivRef} className="devops-input-layout">
                    <div className="devops-input-content">
                        <input
                            ref={this.inputRef}
                            type="text"
                            onFocus={() => this.inputFocusedState()}
                            className="devops-input"
                            placeholder="Search DevOps Work Items"
                        />

                        <Button
                            key={`bt-question-send`}
                            icon={<Search24Regular />}
                            onClick={() => this.onSearchBtnClick()}
                            appearance="transparent"
                        />
                    </div>
                </div>

                {hasWorkItem ? (
                    <div className="devops-list-layout">
                        <div className="work-items-table-title-layout">
                            <Text key="text-work-item-title" className="work-items-table-title">
                                Title
                            </Text>
                            <Text key="text-work-item-url" className="work-items-table-title">
                                URL
                            </Text>
                            <Text key="text-work-item-type" className="work-items-table-title">
                                WorkItemType
                            </Text>
                        </div>
                        {this.state.workItems?.map((item: DevOpsModel, index) => {
                            return (
                                <>
                                    {index !== 0 && (
                                        <div
                                            key={`div-items-divider-${index}`}
                                            className="divider"
                                        />
                                    )}
                                    <div key={`div-item-${index}`} className="work-items-layout">
                                        <Text key={`text-item-title-${index}`}>{item.properties[0].Title}</Text>
                                        <Text key={`text-item-url-${index}`}>{item.properties[0].URL}</Text>
                                        <Text key={`text-item-type-${index}`}>{item.properties[0].WorkItemType}</Text>
                                    </div>
                                </>
                            );
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

    protected loadingContent(): JSX.Element | undefined {
        return (
            <div style={{ display: "grid" }}>
                <Spinner label="Loading..." labelPosition="below" />
            </div>
        );
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
                workItems: this.state.workItems,
                inputFocused: false,
            });
        }
    }

    private onSearchBtnClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const workItems: DevOpsModel[] = await DevOpsSearch(this.inputRef.current.value);
            this.setState({
                workItems: workItems,
                inputFocused: false,
            });
            this.inputRef.current.value = "";
        }
    };

    private inputFocusedState = () => {
        this.setState({
            workItems: this.state.workItems,
            inputFocused: true,
        });
    };
}
