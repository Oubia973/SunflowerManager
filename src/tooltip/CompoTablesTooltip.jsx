import React from "react";

const CompoTablesTooltip = ({ items, value, filterFn, setCompoTable }) => {
    const list = (Array.isArray(items) ? items : [items])
        .filter((entry) => (filterFn ? filterFn(entry) : true))
        .map((entry, idx) => {
            const { table } = setCompoTable(entry, value);
            return <React.Fragment key={`${entry}-${idx}`}>{table}</React.Fragment>;
        });

    return <>{list}</>;
};

export default CompoTablesTooltip;
