import { Icon } from '@iconify/react';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import React from 'react';
import { ICONS } from '../../../../../../../../../../icons/iconify-icons-mapping';

export const ChoiceButtonGroup = ({
  options,
  type,
}: {
  options: { id: string; icon: string; label: string; onClick: () => void }[];
  type: 'accept' | 'reject';
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const optionsWithoutFirstItem = options.slice(1);

  return (
    <>
      <ButtonGroup variant={type === 'accept' ? 'contained' : 'outlined'} ref={anchorRef}>
        <Button
          startIcon={<Icon icon={options[0].icon} width={25} height={25} />}
          onClick={options[0].onClick}
        >
          {options[0].label}
        </Button>
        <Button size="small" onClick={handleToggle}>
          <Icon icon={ICONS.ARROW_DROPDOWN} width={25} height={25} />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {optionsWithoutFirstItem.map((option) => (
                    <MenuItem key={option.id} onClick={option.onClick}>
                      <ListItemIcon>
                        <Icon icon={option.icon} width={25} height={25} />
                      </ListItemIcon>
                      <ListItemText>{option.label}</ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};