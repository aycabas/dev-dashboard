import "../styles/OfficeOasis.css";
import "../styles/Common.css";
import { Image, Text, Divider } from "@fluentui/react-components";
import { TeamsFxContext } from "../../internal/context";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";
import { Mail, MailIsSupported } from "../components/Mail";
import { Call, CallIsSupported } from "../components/Call";
import { Avatars } from "../components/Avatars";


export class OfficeOasis extends Widget<any> {
    constructor(props: any) {
        super(props);
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
                    Office Oasis
                </Text>
            </div>
        );
    }

    protected bodyContent(): JSX.Element | undefined {
        return (           
            <div className={"has-task-layout"}>
                <Avatars />
                <Divider style={{ height: "100%" }}>
                    {MailIsSupported() && <Mail /> }
                    {CallIsSupported() && <Call /> }
                </Divider>
            </div>
        );
    }
}
