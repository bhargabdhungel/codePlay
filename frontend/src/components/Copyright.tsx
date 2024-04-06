import { Typography } from "@mui/material";
export default function Copyright(props: { link : string, website : string}) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" mt={6}>
      {'Copyright © '}
      <a color="inherit" href={props.link}>
        {props.website}
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}