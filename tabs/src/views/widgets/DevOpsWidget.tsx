import * as d3 from "d3-format";

import { AreaChart, IChartProps } from "@fluentui/react-charting";
import { Avatar, Button, Text, ToggleButton, tokens } from "@fluentui/react-components";
import {
    ArrowMaximize20Regular,
    ArrowRight16Filled,
    ChevronRight20Regular,
    MoreHorizontal16Filled,
    MoreHorizontal32Regular,
    Rocket20Regular,
    Search20Regular,
    Settings20Regular,
    Trophy20Regular,
} from "@fluentui/react-icons";

import { DayRange, DayRangeModel } from "../../models/dayRangeModel";
import { DevOpsModel } from "../../models/devOpsModel";
import { DevOpsWorkItems } from "../../services/devopsService";
import ProgressBar from "../components/Progress";
import { Widget } from "../lib/Widget";
import { footerBtnStyle, headerStyleWithoutIcon } from "../lib/Widget.styles";
import {
    actionLayout,
    areaChartLayout,
    areaChartStyle,
    avatarStyle,
    backlogLayout,
    backlogStyle,
    bodyLayout,
    divider,
    legendBoldStyle,
    legendDividerStyle,
    legendItemLayout,
    legendLayout,
    legendNormalStyle,
    minWidthStyle,
    stateLayout,
    stateStyle,
    tableColumnStyle,
    tableContentLayout,
    tableHeaderStyle,
    tableLayout,
    timeSpanLayout,
    timeSpanStyle,
    titleStyle,
} from "../styles/Chart.style";
import { CSSProperties } from "react";
import { widgetPaddingStyle } from "../styles/Common.styles";

interface IChartWidgetState {
    dayRange: DayRange;

    devOpsData?: DevOpsModel[];
}

export class DevOps extends Widget<IChartWidgetState> {
    async getData(): Promise<IChartWidgetState> {



        return {
            dayRange: DayRange.Seven,
            devOpsData: await DevOpsWorkItems(),
        };
    }

    headerContent(): JSX.Element | undefined {
        return (
            <div key="div-chart-header" style={headerStyleWithoutIcon}>
                <Text key="text-chart-title" style={areaChartStyle}>
                    Area chart
                </Text>
                <div key="div-chart-actions" style={actionLayout}>
                    <Button key="bt-chart-search" icon={<Search20Regular />} appearance="transparent" />
                    <Button key="bt-chart-max" icon={<ArrowMaximize20Regular />} appearance="transparent" />
                    <Button key="bt-chart-setting" icon={<Settings20Regular />} appearance="transparent" />
                    <Button key="bt-chart-more" icon={<MoreHorizontal32Regular />} appearance="transparent" />
                </div>
            </div>
        );
    }

    bodyContent(): JSX.Element | undefined {
        return (
            <div key="div-chart-body" style={bodyLayout}>


                <div key="div-table-layout" style={tableLayout}>
                    <div key="div-back-log" style={backlogLayout}>
                        <Text key="text-back-log" style={backlogStyle}>
                            Features backlog (57)
                        </Text>
                        <Button
                            key="bt-back-log-more"
                            icon={<MoreHorizontal16Filled />}
                            appearance="transparent"
                        />
                    </div>

                    <div key="div-table-content" style={tableContentLayout}>
                        <div key="div-table-column" style={tableColumnStyle}>
                            <Text
                                key="text-table-header-title"
                                style={{ ...minWidthStyle(8), ...tableHeaderStyle }}
                            >
                                Title
                            </Text>
                            <Text
                                key="text-table-header-assigned"
                                style={{ ...minWidthStyle(18), ...tableHeaderStyle }}
                            >
                                Created by
                            </Text>


                        </div>
                        {this.state.data?.devOpsData?.map((item: DevOpsModel, index) => {
                            return (
                                <>
                                    {index !== 0 && <div key={`table-divider-${item.id}`} style={divider} />}
                                    <div key={`div-table-column-${item.id}`} style={tableColumnStyle}>
                                        <div key={`div-table-title-${item.id}`} style={titleStyle}>
                                            <ChevronRight20Regular key={`icon-chevron-${item.id}`} />
                                            {index !== 3 ? (
                                                <Rocket20Regular key={`icon-rocket-${item.id}`} />
                                            ) : (
                                                <Trophy20Regular key={`icon-trophy-${item.id}`} />
                                            )}
                                            <Text key={`text-title-${item.id}`} wrap={false}>
                                                {item.fields.workItemType}: {item.fields.title}
                                            </Text>
                                        </div>

                                        <div key={`div-table-avatar-${item.id}`} style={avatarStyle}>
                                            <Avatar
                                                key={`avatar-assigned-${item.id}`}
                                                name={item.fields.createdBy?.displayName}
                                                image={{ src: `${item.fields.createdBy?.links?.avatar}` }}
                                                size={16}
                                            />
                                            <Text key={`text-assigned-${item.id}`}>{item.fields.createdBy?.displayName}</Text>
                                        </div>


                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    footerContent(): JSX.Element | undefined {
        return (
            <Button
                key="bt-chart-footer"
                appearance="transparent"
                icon={<ArrowRight16Filled />}
                iconPosition="after"
                size="small"
                style={footerBtnStyle}
                onClick={() => { }} // navigate to detailed page
            >
                View query
            </Button>
        );
    }

    customiseWidgetStyle(): CSSProperties | undefined {
        return widgetPaddingStyle;
    }

}
