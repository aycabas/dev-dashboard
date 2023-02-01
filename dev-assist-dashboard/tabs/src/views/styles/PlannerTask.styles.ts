import { CSSProperties } from "react";

import { tokens } from "@fluentui/react-components";

const borderStyle: CSSProperties = {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "white",
};

export const bodyLayout = (hasTask: boolean): CSSProperties => {
    if (hasTask) {
        return {
            display: "grid",
            gap: "0.25rem",
            overflowX: "hidden",
            minWidth: "18rem",
        };
    } else {
        return {
            display: "grid",
            gap: "1.8rem",
            overflowX: "hidden",
            minWidth: "18rem",
        };
    }
};

export const addBtnStyle: CSSProperties = {
    color: tokens.colorBrandForeground1,
    marginLeft: "0.35rem",
    padding: 0,
};

export const inputStyle = (focused?: boolean): CSSProperties => ({
    border: "none",
    outline: "medium",
    height: "1.75rem",
    marginLeft: "-0.35rem",
    fontSize: "0.875rem",
    color: tokens.colorNeutralForeground1,
    backgroundColor: focused ? tokens.colorNeutralBackground6 : tokens.colorNeutralBackground3,
});
export const inputCodeStyle = (focused?: boolean): CSSProperties => ({
    border: "none",
    outline: "medium",
    height: "1.75rem",
    marginLeft: "-0.35rem",
    fontSize: "0.875rem",
    color: tokens.colorNeutralForeground1,
    backgroundColor: focused ? tokens.colorNeutralBackground6 : tokens.colorNeutralBackground3,
});

export const addTaskContainer = (themeString: string, focused?: boolean): CSSProperties => {
    const border: CSSProperties = themeString === "contrast" ? borderStyle : {};
    return {
        display: "grid",
        gridTemplateColumns: "max-content 1fr max-content",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: focused ? tokens.colorNeutralBackground6 : tokens.colorNeutralBackground3,
        borderRadius: "4px",
        height: "2.25rem",
        paddingLeft: "0.875rem",
        paddingRight: "0.7rem",
        ...border,
    };
};

export const addTaskBtnStyle = (mouseEnter?: boolean): CSSProperties => ({
    borderRadius: "4px",
    width: "max-content",
    height: "1.5rem",
    border: "none",
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: mouseEnter ? tokens.colorNeutralStroke1Hover : tokens.colorNeutralStrokeOnBrand2,
});

export const existingTaskLayout = (themeString: string): CSSProperties => {
    const border: CSSProperties = themeString === "contrast" ? borderStyle : {};
    return {
        display: "grid",
        gridTemplateColumns: "1fr max-content",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: "4px",
        height: "auto",
        paddingLeft: "0.875rem",
        paddingRight: "0.7rem",
        ...border,
    };
};

export const descriptionStyle: CSSProperties = {
    fontWeight: "400",
    fontSize: "0.75rem",
    lineHeight: "1rem",
    marginBottom: "1.125rem",
    color: tokens.colorNeutralForeground3,
    marginTop: "0.25rem",
};