import {
    AvatarGroup,
    AvatarGroupItem,
    AvatarGroupPopover,
    partitionAvatarGroupItems,
    AvatarGroupProps,
  } from "@fluentui/react-components";
  const names = [
    "Ayca Bas",
    "Rabia Williams",    
  ];
  
  export const Avatars  = () => {
    const { inlineItems, overflowItems } = partitionAvatarGroupItems({
      items: names,
    });
  
    return (
      <AvatarGroup layout="spread" size={64}>
        {inlineItems.map((name) => (
          <AvatarGroupItem name={name} key={name} />
        ))}
  
        {overflowItems && (
          <AvatarGroupPopover>
            {overflowItems.map((name) => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
    );
  };
  