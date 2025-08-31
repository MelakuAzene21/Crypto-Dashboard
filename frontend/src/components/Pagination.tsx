import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getVisiblePages = () => {
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        p: 3,
        bgcolor: 'rgba(30, 41, 59, 0.3)',
        borderRadius: 3,
        border: '1px solid rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Items per page selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Show:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            sx={{
              color: 'white',
              bgcolor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover': {
                border: '1px solid rgba(59, 130, 246, 0.3)',
              },
              '&.Mui-focused': {
                border: '1px solid rgba(59, 130, 246, 0.5)',
              },
            }}
          >
            {itemsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          of {totalItems} items
        </Typography>
      </Box>

      {/* Page info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalItems} results
      </Typography>

      {/* Pagination controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* First page button */}
        <IconButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          sx={{
            color: currentPage === 1 ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              bgcolor: currentPage === 1 ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          <FirstPage />
        </IconButton>

        {/* Previous page button */}
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{
            color: currentPage === 1 ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              bgcolor: currentPage === 1 ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        {/* Page numbers */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getVisiblePages().map((page, index) => (
            <Box key={index}>
              {page === '...' ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1, py: 0.5 }}
                >
                  ...
                </Typography>
              ) : (
                <IconButton
                  onClick={() => handlePageClick(page as number)}
                  sx={{
                    minWidth: 40,
                    height: 40,
                    color: currentPage === page ? 'white' : 'text.secondary',
                    bgcolor: currentPage === page ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: currentPage === page 
                        ? 'primary.dark' 
                        : 'rgba(59, 130, 246, 0.1)',
                    },
                    fontWeight: currentPage === page ? 600 : 400,
                  }}
                >
                  {page}
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        {/* Next page button */}
        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{
            color: currentPage === totalPages ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              bgcolor: currentPage === totalPages ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>

        {/* Last page button */}
        <IconButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          sx={{
            color: currentPage === totalPages ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              bgcolor: currentPage === totalPages ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          <LastPage />
        </IconButton>
      </Box>
    </Box>
  );
}
