'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@orc/web/ui/custom-ui';
import { LucideIcon, MoreHorizontal } from 'lucide-react';
import React from 'react';

interface Action {
  icon: LucideIcon;
  className?: string;
  label: string;
  shortcut: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface AdvancedDropdownProps {
  sections: Action[][];
}
export function SimpleDropdown(props: AdvancedDropdownProps) {
  const { sections } = props;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={false}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {sections.map((actions, index) => {
          return (
            <React.Fragment key={index}>
              <DropdownMenuSeparator />
              {actions.map((action, actionIndex) => (
                <DropdownMenuItem
                  disabled={action.disabled}
                  key={actionIndex}
                  onClick={action.onClick}
                  className={action.className && action.className}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                  {action.children}
                </DropdownMenuItem>
              ))}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
