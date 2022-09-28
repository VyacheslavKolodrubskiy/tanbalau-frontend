/// <reference types="vite/client" />

import type {
  Affix,
  Avatar,
  BackTop,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  InputPassword,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  Modal,
  PageHeader,
  Radio,
  RadioGroup,
  Row,
  Select,
  Space,
  Spin,
  Step,
  Steps,
  SubMenu,
  Table,
  TableSummary,
  TableSummaryCell,
  TableSummaryRow,
  Textarea,
  Timeline,
  TimelineItem,
  Tooltip,
  TypographyTitle,
  Upload,
} from 'ant-design-vue';
import type { checkPermission } from '@/utils/permissions';
import type { format } from '@/utils/format';
import type { PermissionRole } from '@/types';

declare module '*.vue' {
  import type { DefineComponent } from '@vue/runtime-core';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// declare global {
//   type TODO_TS_MIGRATION = any; // todo remove
// }

declare module 'vue-router' {
  interface RouteMeta {
    onlyLoggedOut?: boolean
    title?: string
    breadcrumbName?: string
    permissions?: PermissionRole[]
    demoAccess?: {
      videoId: string
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $canUse: typeof checkPermission
    $format: typeof format
  }
  interface GlobalComponents {
    AAffix: typeof Affix
    AAvatar: typeof Avatar
    ABackTop: typeof BackTop
    ABreadcrumb: typeof Breadcrumb
    AButton: typeof Button
    ACard: typeof Card
    ACol: typeof Col
    ADatePicker: typeof DatePicker
    ADivider: typeof Divider
    ADropdown: typeof Dropdown
    AEmpty: typeof Empty
    AForm: typeof Form
    AFormItem: typeof FormItem
    AInput: typeof Input
    AInputNumber: typeof InputNumber
    AInputPassword: typeof InputPassword
    ALayout: typeof Layout
    ALayoutContent: typeof LayoutContent
    ALayoutHeader: typeof LayoutHeader
    ALayoutSider: typeof LayoutSider
    AMenu: typeof Menu
    AMenuItem: typeof MenuItem
    AModal: typeof Modal
    APageHeader: typeof PageHeader
    ARadio: typeof Radio
    ARadioGroup: typeof RadioGroup
    ARow: typeof Row
    ASelect: typeof Select
    ASpace: typeof Space
    ASpin: typeof Spin
    AStep: typeof Step
    ASteps: typeof Steps
    ASubMenu: typeof SubMenu
    ATable: typeof Table
    ATableSummary: typeof TableSummary
    ATableSummaryCell: typeof TableSummaryCell
    ATableSummaryRow: typeof TableSummaryRow
    ATextarea: typeof Textarea
    ATimeline: typeof Timeline
    ATimelineItem: typeof TimelineItem
    ATooltip: typeof Tooltip
    ATypographyTitle: typeof TypographyTitle
    AUpload: typeof Upload
  }
}
