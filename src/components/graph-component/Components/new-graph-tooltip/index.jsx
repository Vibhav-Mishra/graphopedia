import {
  Container,
  SmallContainer,
  TooltipBody,
  TooltipBodyValue,
  TooltipBodyWrapper,
  TooltipLabel,
  TooltipLegend,
  TooltipSubTitle,
  TooltipTitle,
} from "./index.sc";

const NewGraphTooltip = ({ data }) => {
  return !Array.isArray(data.labels) ? (
    <SmallContainer>
      <TooltipBodyWrapper>
        <TooltipSubTitle>{data?.subTitle}</TooltipSubTitle>
        <TooltipBodyValue>{data.labels.value}</TooltipBodyValue>
      </TooltipBodyWrapper>
    </SmallContainer>
  ) : (
    <Container>
      <TooltipTitle>{data?.title}</TooltipTitle>
      <TooltipSubTitle>{data?.subTitle}</TooltipSubTitle>
      <TooltipBody>
        {data?.labels?.map((label, index) => {
          return (
            <TooltipBodyWrapper key={index}>
              <TooltipLegend color={label.color} />
              <TooltipLabel>{label.label}</TooltipLabel>
              <TooltipBodyValue>{label.value}</TooltipBodyValue>
            </TooltipBodyWrapper>
          );
        })}
      </TooltipBody>
    </Container>
  );
};

export default NewGraphTooltip;
